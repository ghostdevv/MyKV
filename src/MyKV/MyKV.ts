import { MyKVOptions } from '../options/options';
import { BaseMyKV } from './BaseMyKV';

export class MyKV extends BaseMyKV {
    constructor(options?: MyKVOptions) {
        super(options);
    }
}

export default MyKV;
