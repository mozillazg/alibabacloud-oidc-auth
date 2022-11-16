'use strict';

import * as core from '@actions/core';
import Client, { AssumeRoleWithOIDCRequest } from '@alicloud/sts20150401';
import * as openapi from '@alicloud/openapi-client';
import Credential, { Config } from '@alicloud/credentials';
import * as teaUtil from  '@alicloud/tea-util';
import { withRetries } from '@google-github-actions/actions-utils';
import * as utils from  "./utils";
import {setOutputs} from "./utils";

async function assumeRole(region: string, roleArn: string, oidcArn: string,
                          oidcToken: string, durationSeconds: Number, sessionName: string) {
    const cred = new Credential(new Config({
        type: 'access_key',
        accessKeyId: 'xxx',
        accessKeySecret: 'xxx',
    }))
    const conf = new openapi.Config({
        cred: cred,
        regionId: region,
        protocol: 'https',
    })
    const client = new Client(conf)
    const req = new AssumeRoleWithOIDCRequest({
        durationSeconds: durationSeconds,
        OIDCProviderArn: oidcArn,
        OIDCToken: oidcToken,
        roleArn: roleArn,
        roleSessionName: sessionName,
    })
    const opts = new teaUtil.RuntimeOptions({
        connectTimeout: 5000,
        readTimeout: 5000,
    });

    return client.assumeRoleWithOIDCWithOptions(req, opts).then(function (data) {
        return {
            // @ts-ignore
            accessKeyId: data.body.credentials.accessKeyId,
            // @ts-ignore
            accessKeySecret: data.body.credentials.accessKeySecret,
            // @ts-ignore
            securityToken: data.body.credentials.securityToken,
        }
    })
}

async function main() {
    const audience = core.getInput('audience', { required: false });
    const oidcToken = await core.getIDToken(audience);
    const region = core.getInput('region', { required: false });
    const roleArn = core.getInput('role-arn-to-assume', { required: true });
    const oidcArn = core.getInput('oidc-provider-arn', { required: true });
    const durationSeconds = Number(core.getInput('role-duration-seconds', { required: false }));
    const sessionName = core.getInput('role-session-name', { required: false });
    const exportEnvs = core.getBooleanInput('export-environment-variables', { required: false });
    const setOutputs = core.getBooleanInput('set-outputs', { required: false });

    const { accessKeyId, accessKeySecret, securityToken } = await assumeRole(
        region, roleArn, oidcArn, oidcToken, durationSeconds, sessionName);

    if (exportEnvs) {
        // @ts-ignore
        utils.exportEnvs(accessKeyId, accessKeySecret, securityToken);
    }
    if (setOutputs) {
        // @ts-ignore
        utils.setOutputs(accessKeyId, accessKeySecret, securityToken);
    }
}

async function run() {
    const retries = Number(core.getInput('retries', { required: false }));
    await withRetries(main, {
        retries: retries,
        backoff: 300,
    })();
}

run();
