const core = require('@actions/core');
const sts = require('@alicloud/sts20150401');
const openapi = require('@alicloud/openapi-client');
const creds = require('@alicloud/credentials');
const teaUtil = require('@alicloud/tea-util');
const utils = require("./utils");

async function assumeRole(region, roleArn, oidcArn, oidcToken, durationSeconds, sessionName, retries) {
    const cred = new creds.Credential(new creds.Config({
        type: 'access_key',
        accessKeyId: 'xxx',
        accessKeySecret: 'xxx',
    }))
    const conf = new openapi.Config({
        cred: cred,
        regionId: region,
        protocol: 'https',
    })
    const client = new sts.Client(conf)
    const req = new sts.AssumeRoleWithOIDCRequest({
        durationSeconds: durationSeconds,
        OIDCProviderArn: oidcArn,
        OIDCToken: oidcToken,
        roleArn: roleArn,
        roleSessionName: sessionName,
    })
    const opts = new teaUtil.RuntimeOptions({
        autoretry: retries > 0,
        maxAttempts: retries,
    });

    return client.assumeRoleWithOIDCWithOptions(req, opts).then(function (data) {
        return {
            accessKeyId: data.body.credentials.accessKeyId,
            accessKeySecret: data.body.credentials.accessKeySecret,
            securityToken: data.body.credentials.securityToken,
        }
    })
}

async function main() {
    const audience = core.getInput('audience');
    const oidcToken = core.getIDToken(audience);
    const region = core.getInput('region');
    const roleArn = core.getInput('role-arn-to-assume');
    const oidcArn = core.getInput('oidc-provider-arn');
    const durationSeconds = Number(core.getInput('role-duration-seconds'));
    const sessionName = core.getInput('role-session-name');
    const exportEnvs = core.getBooleanInput('export_environment_variables');
    const retries = Number(core.getInput('retries'));

    const cred = await assumeRole(region, roleArn, oidcArn, oidcToken, durationSeconds, sessionName, retries);

    if (exportEnvs) {
        utils.exportEnvs(cred.accessKeyId, cred.accessKeySecret, cred.securityToken);
    }
}

async function run() {
    await main();
}

run();
