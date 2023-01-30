alibabacloud-oidc-auth
-----------------------

GitHub Action for authenticating to Alibaba Cloud with `GitHub Actions OIDC tokens`_.

.. contents::


Example Usage
==============

.. code-block:: yaml

    jobs:
      job-id:
        # ...
        permissions:
          id-token: write # This is required for requesting the JWT
        steps:
          - name: get credentials
            id: get-credentials
            uses: 'mozillazg/alibabacloud-oidc-auth@v1'
            with:
              role-arn-to-assume: '${{ secrets.ALIBABA_CLOUD_RAM_ROLE_ARN }}'
              oidc-provider-arn: '${{ secrets.ALIBABA_CLOUD_RAM_OIDC_ARN }}'
              export-environment-variables: 'true'
          - run: |
              aliyun sts GetCallerIdentity


Or

.. code-block:: yaml

    jobs:
      job-id:
        # ...
        permissions:
          id-token: write # This is required for requesting the JWT
        steps:
          - name: get credentials
            id: get-credentials
            uses: 'mozillazg/alibabacloud-oidc-auth@v1'
            with:
              role-arn-to-assume: '${{ secrets.ALIBABA_CLOUD_RAM_ROLE_ARN }}'
              oidc-provider-arn: '${{ secrets.ALIBABA_CLOUD_RAM_OIDC_ARN }}'
              set-outputs: 'true'
          - run: |
              ossutil64 --access-key-id ${{ steps.get-credentials.outputs.access-key-id }} \
                --access-key-secret ${{ steps.get-credentials.outputs.access-key-secret }} \
                --sts-token ${{ steps.get-credentials.outputs.security-token }} --mode StsToken \
                --endpoint oss-ap-southeast-1.aliyuncs.com \
                stat oss://test-bucket


Inputs
======

* ``role-arn-to-assume``: (**Required**) The arn of RAM role.
* ``oidc-provider-arn``: (**Required**) The arn of OIDC IdP.
* ``export-environment-variables``: (Optional) Export common environment variables, including:

  - ``ALIBABA_CLOUD_ACCESS_KEY_ID``
  - ``ALIBABA_CLOUD_ACCESS_KEY_SECRET``
  - ``ALIBABA_CLOUD_SECURITY_TOKEN``
  - ``ALICLOUD_ACCESS_KEY``
  - ``ALICLOUD_SECRET_KEY``
  - ``ALICLOUD_SECURITY_TOKEN``
  - ``ALICLOUD_ACCESS_KEY_STS_TOKEN``
  - ``ALIBABACLOUD_ACCESS_KEY_ID``
  - ``ALIBABACLOUD_ACCESS_KEY_SECRET``
  - ``ALIBABACLOUD_SECURITY_TOKEN``

  The default value is: ``false``
* ``set-outputs``: (Optional) Setting action outputs. The default value is: ``false``
* ``audience``: (Optional) The audience (aud) parameter in GitHub's generated OIDC
  token. The default value is: ``actions.github.com``
* ``role-duration-seconds``: (Optional) The validity period of the STS token. The default value is: ``3600``
* ``role-session-name``: (Optional) The custom name of the role session. The default value is: ``github-actions-<orgName>-<repoName>``
* ``region``: (Optional) The region id of STS endpoint. The default value is: ``ap-southeast-1``

Outputs
========

Only available when ``set-outputs`` is ``true``.

* ``access-key-id``: (Optional) The Alibaba Cloud Access Key ID.
* ``access-key-secret``: (Optional) The Alibaba Cloud Access Key Secret.
* ``security-token``: (Optional) The Alibaba Cloud STS Token.


RAM Configuration
==================

1. Configure an `OIDC IdP`_ for the auth method:
    * **IdP URL**: ``https://token.actions.githubusercontent.com``
    * **Client ID**: ``actions.github.com``

2. Configure a `RAM role for an OIDC IdP`_ to assume:
    * **oidc:aud**: ``actions.github.com``
    * **oidc:sub**: match on `GitHub subject claims`_.

      * match branch: ``repo:<orgName/repoName>:ref:refs/heads/<branchName>``
      * match tag: ``repo:<orgName/repoName>:ref:refs/tags/<tagName>``


.. _GitHub Actions OIDC tokens : https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect
.. _OIDC IdP: https://www.alibabacloud.com/help/en/resource-access-management/latest/manage-an-oidc-idp?spm=a2c63.p38356.0.0.3d076b9do9jEJr#section-hqp-6mi-g84
.. _RAM role for an OIDC IdP: https://www.alibabacloud.com/help/en/resource-access-management/latest/create-a-ram-role-for-a-trusted-idp#section-mra-74d-14w
.. _GitHub subject claims: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect#example-subject-claims

