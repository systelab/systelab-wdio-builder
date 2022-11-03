import { BuilderContext, BuilderOutput, createBuilder, targetFromTargetString } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';

interface Options extends JsonObject {
    devServerTarget: string;
    wdioConfig: string;
    wdioOptions: {};
    port: number;
    host: string;
    disableHostCheck: boolean;
}

export const runWdioTest =  async ( options: Options, context: BuilderContext ): Promise<BuilderOutput> => {
    if(!isWdioInstalled()) {
        context.logger.error("@wdio/cli not installed. Can not run command. Exiting.");
        context.reportStatus('Failed');
        return Promise.resolve({"success": false, "error": "@wdio/cli not installed. Can not run command. Exiting."})
    }

    let server;
    if(options.devServerTarget) {
        const devServerTargetOptions: any = {port: options.port, host: options.host, disableHostCheck: options.disableHostCheck}
        Object.keys(devServerTargetOptions).forEach(key => devServerTargetOptions[key] === undefined && delete devServerTargetOptions[key])

        server = await context.scheduleTarget(targetFromTargetString(options.devServerTarget), devServerTargetOptions);
        const result = await server.result;
        if(!result.success) {
            return Promise.resolve({"success": false, "error": `${options.devServerTarget} failed. Can not run command. Exiting`})
        }
    }

    const Launcher = require('@wdio/cli').default;
    const wdio = new Launcher(options.wdioConfig, options.wdioOptions);

    let wdioResult: BuilderOutput | undefined;
    try {
        wdioResult = await wdio.run().then(
            (code: number) => {
                context.reportStatus(`Done.`);
                context.logger.info(`Result status code: ${code}`);
                return { success: code === 0 }
            },
            (err: any) => {
                context.reportStatus(`Failed.`);
                context.logger.error('Launcher failed to start the test', err.stacktrace)
                return { 'success': false, error: err.message }
            }
        );
    } catch (err) {
        context.reportStatus('Exception.');
        context.logger.error('Exception while running tests', err.message);
        wdioResult = {
            error: err.message,
            success: false
        };
    } finally {
        if (server) {
            context.logger.info(`Stopping development server...`);
            await server.stop();
        }
    }

    if (!wdioResult) {
        return { success: false };
    }

    return wdioResult;
}

export default createBuilder(runWdioTest);

function isWdioInstalled(): boolean {
    try {
        require('@wdio/cli').default;
        return true;
    } catch (err) {
        return false;
    }
}

