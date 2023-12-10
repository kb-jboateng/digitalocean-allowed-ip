import * as core from "@actions/core";
import { HttpClient } from "@actions/http-client";


export async function run() : Promise<void> {

    const RULE_TYPE = 'ip_addr';
    const IPIFY_ENDPOINT = 'https://api.ipify.org?format=json';
        
    // get inputs
    const DATABASE_ID = core.getInput('database_id');
    const MAX_RETRIES = parseInt(core.getInput('max_retries'), 10);
    const DIGITALOCEAN_TOKEN = core.getInput('digitalocean_token');
    const ACTION: 'add' | 'remove' = core.getInput('action') as any;
    
    const DATABASE_ENDPOINT = `https://api.digitalocean.com/v2/databases/${DATABASE_ID}/firewall`;
    const HEADERS = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIGITALOCEAN_TOKEN}`,
    };

    const http = new HttpClient("blxck/digitalocean-allowed-ip", undefined, {
        allowRetries: true,
        maxRetries: MAX_RETRIES
    });

    try {
        // get Ip address of the runner
        const ipv4 = await http.getJson<IPResponse>(IPIFY_ENDPOINT);
        const IP = ipv4.result.ip;

        const firewall = await http.getJson<IFirewallResponse>(DATABASE_ENDPOINT, HEADERS);
        const rules = firewall.result.rules;

        const existingIPIndex = rules.findIndex(rule => rule.type == RULE_TYPE && rule.value == IP);
        if (existingIPIndex === -1 && ACTION == 'add') {
            rules.push({
                value: IP,
                type: RULE_TYPE,
            });
        } else if (existingIPIndex > 0 && ACTION == 'remove') {
            rules.splice(existingIPIndex, 1);
        }

        await http.putJson(DATABASE_ENDPOINT, { rules }, HEADERS);

        core.notice(`${ ACTION  == 'add' ? 'Added' : 'Removed' } : ${IP}`);
    } catch (error) {
        core.setFailed(error?.message);
    }

}


/**
 * IPify Response.
 * @see https://www.ipify.org/
 */
interface IPResponse {
    ip: string;
}

/**
 * Firewall Response
 * @see https://docs.digitalocean.com/reference/api/api-reference/#operation/databases_update_firewall_rules
*/
interface IFirewallResponse {
    rules: {
        type: string;
        uuid?: string;
        value: string;
        created_at?: string;
        cluster_uuid?: string;
    }[]
}