import declarativeNetRequest from './declarative_net_request';
import storage from './storage';
import { type Manifest } from '../../types';

export default function getJsonFields(
  manifest: Manifest,
): Record<string, string | undefined> {
  return {
    // read as: declarativeNetRequest/<id>: declarativeNetRequest(manifestPath, manifest),
    ...declarativeNetRequest(manifest),
    'storage/managed_schema': storage(manifest),
  };
}
