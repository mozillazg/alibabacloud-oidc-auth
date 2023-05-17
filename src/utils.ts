'use strict';

import * as core from "@actions/core";
import * as github from "@actions/github";

export function exportEnvs(accessKeyId: string, accessKeySecret: string, securityToken: string) {
    if (accessKeyId) {
        core.setSecret(accessKeyId);
    }
    if (accessKeySecret) {
        core.setSecret(accessKeySecret);
    }
    if (securityToken) {
        core.setSecret(securityToken);
    }
    core.exportVariable('ALIBABA_CLOUD_ACCESS_KEY_ID', accessKeyId);
    core.exportVariable('ALICLOUD_ACCESS_KEY', accessKeyId);
    core.exportVariable('ALIBABACLOUD_ACCESS_KEY_ID', accessKeyId);

    core.exportVariable('ALIBABA_CLOUD_ACCESS_KEY_SECRET', accessKeySecret);
    core.exportVariable('ALICLOUD_SECRET_KEY', accessKeySecret);
    core.exportVariable('ALIBABACLOUD_ACCESS_KEY_SECRET', accessKeySecret);

    core.exportVariable('ALIBABA_CLOUD_SECURITY_TOKEN', securityToken);
    core.exportVariable('ALICLOUD_ACCESS_KEY_STS_TOKEN', securityToken);
    core.exportVariable('ALIBABACLOUD_SECURITY_TOKEN', securityToken);
    core.exportVariable('ALICLOUD_SECURITY_TOKEN', securityToken);
}

export function setOutputs(accessKeyId: string, accessKeySecret: string, securityToken: string) {
    if (accessKeyId) {
        core.setSecret(accessKeyId);
    }
    if (accessKeySecret) {
        core.setSecret(accessKeySecret);
    }
    if (securityToken) {
        core.setSecret(securityToken);
    }
    core.setOutput('access-key-id', accessKeyId);
    core.setOutput('access-key-secret', accessKeySecret);
    core.setOutput('security-token', securityToken);
}

export function genSessionName(rawName: string) {
    const replaceIllegalCharacters = function (s: string) {
        return s.replace(/[^-\w.@]/g, '@');
    };
    let finalName = rawName;
    if (finalName.length < 2) {
        finalName = 'github-actions-<orgName>-<repoName>';
    }
    if (finalName.includes('<orgName>')) {
        const orgName = github.context.repo.owner;
        finalName = finalName.replace('<orgName>', replaceIllegalCharacters(orgName));
    }
    if (finalName.includes('<repoName>')) {
        const repoName = github.context.repo.repo;
        finalName = finalName.replace('<repoName>', replaceIllegalCharacters(repoName));
    }
    if (finalName.length >= 64) {
        finalName = finalName.slice(0, 63);
    }
    return finalName;
}

