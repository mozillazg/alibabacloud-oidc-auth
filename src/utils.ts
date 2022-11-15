'use strict';

import * as core from "@actions/core";
import {setSecret} from "@actions/core";

export function exportEnvs(accessKeyId: string, accessKeySecret: string, securityToken: string) {
    core.setSecret(accessKeySecret)
    core.setSecret(securityToken)
    core.exportVariable('ALIBABA_CLOUD_ACCESS_KEY_ID', accessKeyId);
    core.exportVariable('ALICLOUD_ACCESS_KEY', accessKeyId);
    core.exportVariable('ALIBABACLOUD_ACCESS_KEY_ID', accessKeyId);
    core.exportVariable('ALIBABA_CLOUD_ACCESS_KEY_SECRET', accessKeyId);
    core.exportVariable('ALICLOUD_SECRET_KEY', accessKeySecret);
    core.exportVariable('ALICLOUD_SECRET_KEY', accessKeySecret);
    core.exportVariable('ALIBABACLOUD_ACCESS_KEY_SECRET', accessKeySecret);
    core.exportVariable('ALIBABA_CLOUD_SECURITY_TOKEN', securityToken);
    core.exportVariable('ALICLOUD_ACCESS_KEY_STS_TOKEN', securityToken);
    core.exportVariable('ALIBABACLOUD_SECURITY_TOKEN', securityToken);
}
