class ContractUtils {

    static isCollectable( contractSource: string ){
        if( contractSource.indexOf('collectable') != -1 ) return true;
        else return false;
    }
}

export default ContractUtils;