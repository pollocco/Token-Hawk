import TokenHawk from './lib/controllers/tokenHawk';
import BscApi from './lib/apis/bscApi';
import EtherApi from './lib/apis/etherApi';

async function app(){
    var tokenHawk = new TokenHawk( new BscApi() );
    await tokenHawk.run( 3000 );
}

app();