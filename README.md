# Getting started

1. Install

    ```shell
    npm i @jrposada/pm-creds -g
    ```

2. Create config files and self-signed certificates

    ```shell
    pm-creds init
    ```

3. Start server

    ```shell
    pm-creds
    ```

## Configure Postman

Add the next `pre-script` to postman. It will request the target AWS profile define through `aws_profile` and inject the tokens it into the request. For AWS you also need to select "AWS Signature" as auth method:

![Postman Auth Tab](./docs/postman-auth-config.png)

```
let profile = pm.collectionVariables.get("aws_profile");

if (!profile) {
    profile = pm.environment.get("aws_profile")
}

if (!profile) {
    throw new Error("'aws_profile' variable not set")
}

pm.sendRequest({
    url: `https://localhost:9999/aws/${profile}`,
    method: "GET",
    }, function (_, response) {
        if (response.status == "OK") {
            const body = response.json()
            pm.variables.set("aws_access_key_id", body.aws_access_key_id)
            pm.variables.set("aws_secret_access_key", body.aws_secret_access_key)
            if (body.aws_session_token) {
                pm.variables.set("aws_session_token", body.aws_session_token)
            }
            console.log(`using aws credentials from '${profile}'`)
            return
        } else {
            console.log(err)
            throw new Error(response.text() || JSON.stringify(err) || "unknown error fetching aws credentials")
        }
    }
)
```
