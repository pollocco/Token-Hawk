var socket = io();

socket.emit('get tokens');
socket.emit('get web console');

var lastUpdatedCells = [];

var unliquidatedHidden = false;
var scamsHidden = false;

function hideScams(){
    var warningDivs = document.getElementsByClassName('warning-cell');
    var el = document.getElementById('hide-scams');
    scamsHidden = !scamsHidden;
    if( scamsHidden ){
        el.classList.add('active');
        for( w of warningDivs ){
            if( w.isScam ){
                w.parentElement.style.display = 'none';
                w.parentElement.hideScam = true;
            }
        }
    } else {
        if( el.classList.contains('active') ) el.classList.remove('active');
        for( w of warningDivs ){
            w.parentElement.hideScam = false;
            if( w.parentElement.style.display === 'none' ){
                if( !w.parentElement.hideUnliquidated ){
                    w.parentElement.style.display = '';
                }
            }
        }
    }
}

function hideUnliquidated(){
    var el = document.getElementById('hide-unliquidated');
    var liqs = document.getElementsByClassName('liq');
    unliquidatedHidden = !unliquidatedHidden;
    if( unliquidatedHidden ){
        el.classList.add('active');
        for( l of liqs ){
            if( l.liqValue < 0.1 ){
                l.parentElement.style.display = 'none';
                l.parentElement.hideUnliquidated = true;
            }
        }
    } else {
        if( el.classList.contains('active') ) el.classList.remove('active');
        for( l of liqs ){
            l.parentElement.hideUnliquidated = false;
            if( !l.parentElement.hideScam ) {
                l.parentElement.style.display = "";
            }
            
            
        }
    }
    

}

function createButtonLink( href, buttonText, buttonType ) {
    let buttonLink = document.createElement('a');
    buttonLink.href = href;
    let button = document.createElement('button');
    button.setAttribute("type", "button");
    button.className = "btn btn-sm btn-" + buttonType
    button.textContent = buttonText;
    buttonLink.setAttribute('target', '_blank');
    buttonLink.appendChild( button );
    return buttonLink
}

function getTimeDiffReadable( time ){
    if( time <= 0 ){
        return "Currently unlocked"
    }

    function makeTimeDiffStr(timeDiff){

        if( timeDiff.dd ) return ( timeDiff.dd === 1 ? timeDiff.dd + " day" : timeDiff.dd + " days" );
        else if( timeDiff.hh ) {
            var hoursStr, minutesStr;
            hoursStr = ( timeDiff.hh === 1 ?  timeDiff.hh + " hour " : timeDiff.hh + " hours " );
            minutesStr = ( timeDiff.mm === 1 ?  timeDiff.mm + " minute" : timeDiff.mm + " minutes" );
            return hoursStr + minutesStr;
        } 
        else if( timeDiff.mm ) return ( timeDiff.mm === 1 ?  timeDiff.mm + " minute" : timeDiff.mm + " minutes" );
        else if( timeDiff.ss ) return " < 1 minute"
    }

    var dd = Math.floor(time / 60 / 60 / 24);
    time -= dd * 60 * 60 * 24;
    var hh = Math.floor(time / 60 / 60);
    time -= hh * 60 * 60;
    var mm = Math.floor(time / 60);
    time -= mm * 60;
    var ss = time;
    time -= ss;

    return makeTimeDiffStr({dd, hh, mm, ss});
}

function updateLiqColor( liqCell, baseValueReadable ) {
    liqCell.style.color = (()=>{
        if( baseValueReadable < 0.1 ) return '#D5737B';
        else if( baseValueReadable < 1.0 ) return '#ED9B40'
        else return '#76B041'
    })()
}

function makeRow( token, table ) {
    var rows = document.getElementsByClassName( 'token-row' );
    var isAlreadyAdded = false;
    for( r of rows ){
        if( token.tokenAddress == r.id ) isAlreadyAdded = true;
    }
    if( isAlreadyAdded ){
        var oldRow = document.getElementById(`${token.tokenAddress}`);
    }
    let row = table.insertRow(0);
    row.id = token.tokenAddress;
    row.className = 'token-row';

    let nameCell = document.createElement('td');
    let dateCell = document.createElement('td');
    let lastUpdatedCell = document.createElement('td');
    let liqText = document.createElement('span');
    let liqCell = document.createElement('td');
    let holdersCell = document.createElement('td');
    let swapButtonSpan = document.createElement('span'); 
    let scannerButtonSpan = document.createElement('span'); 
    let buttonsCell = document.createElement('td'); 

    liqCell.id = `${token.tokenAddress}-liq`;
    liqCell.className = 'liq';        

    nameCell.textContent = token.tokenName;

    var warningCell = document.createElement('td');
    warningCell.className = "warning-cell";

    let warningCellDiv = document.createElement('div');
    warningCellDiv.className = 'warning-div';

    if( ( token?.honeypot && token.honeypot.IsHoneypot === true )
    || ( token?.scScams && token.scScams.isCollectable === true )){
        warningCell.isScam = true;
        let warningLink = document.createElement('a');
        warningLink.href = token.scannerRootUrl + "address/" + token.tokenAddress + "#code";
        warningLink.setAttribute('target', '_blank');
        let warningDiv = document.createElement('span');
        warningDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#d33a3a" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>`
        var reason;
        if( token?.honeypot && token.honeypot.IsHoneypot === true ){
            reason = "Honeypot."
        }
        if( token?.scScams && token.scScams.isCollectable === true ){
            reason = "'Collectable' token; can't be sold."
        }
        row.classList.add('table-danger');
        warningDiv.setAttribute('data-bs-toggle', 'tooltip');
        warningDiv.setAttribute('data-bs-placement', 'top');
        warningDiv.setAttribute('data-bs-html', 'true');
        warningDiv.setAttribute('title', "<b>Scam detected!</b> <p>" + reason + "</p>");
        warningDiv.className = 'warning';
        
        var tooltip = new bootstrap.Tooltip(warningDiv, {
            container: 'body'
          });
        warningLink.appendChild(warningDiv)
        warningCellDiv.appendChild(warningLink);
    }

    if( token.isRenounced ) {
        let renouncedLink = document.createElement('a');
        renouncedLink.href = token.scannerRootUrl + "tx/" + token.renounceTx;
        renouncedLink.setAttribute('target', '_blank');
        let renouncedIcon = document.createElement('span');
        renouncedIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" class="bi bi-balloon-fill" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M8.48 10.901C11.211 10.227 13 7.837 13 5A5 5 0 0 0 3 5c0 2.837 1.789 5.227 4.52 5.901l-.244.487a.25.25 0 1 0 .448.224l.04-.08c.009.17.024.315.051.45.068.344.208.622.448 1.102l.013.028c.212.422.182.85.05 1.246-.135.402-.366.751-.534 1.003a.25.25 0 0 0 .416.278l.004-.007c.166-.248.431-.646.588-1.115.16-.479.212-1.051-.076-1.629-.258-.515-.365-.732-.419-1.004a2.376 2.376 0 0 1-.037-.289l.008.017a.25.25 0 1 0 .448-.224l-.244-.487ZM4.352 3.356a4.004 4.004 0 0 1 3.15-2.325C7.774.997 8 1.224 8 1.5c0 .276-.226.496-.498.542-.95.162-1.749.78-2.173 1.617a.595.595 0 0 1-.52.341c-.346 0-.599-.329-.457-.644Z"/>
                                   </svg>`
        renouncedIcon.className = 'renouncedIcon renounced';
        renouncedIcon.setAttribute('data-bs-toggle', 'tooltip');
        renouncedIcon.setAttribute('data-bs-placement', 'top');
        renouncedIcon.setAttribute('data-bs-html', 'true');
        renouncedIcon.id = `${token.tokenAddress}-lock`;

        renouncedIcon.setAttribute('title', "<b>Contract renounced!</b>");
        var tooltip = new bootstrap.Tooltip(renouncedIcon);
        renouncedLink.appendChild(renouncedIcon);
        warningCellDiv.appendChild(renouncedLink);
    }

    if( token.lockStatus ) {
        let lockIconLink = document.createElement('a');
        lockIconLink.href = token.lockStatus.lockUrl;
        lockIconLink.setAttribute('target', '_blank');
        let lockIcon = document.createElement('span');
        lockIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" class="bi bi-lock-fill" viewBox="0 0 16 16">
                                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                            </svg>`
        lockIcon.className = 'lockIcon lock';
        lockIcon.setAttribute('data-bs-toggle', 'tooltip');
        lockIcon.setAttribute('data-bs-placement', 'top');
        lockIcon.setAttribute('data-bs-html', 'true');
        lockIcon.id = `${token.tokenAddress}-lock`;
        var timeToUnlock = parseInt(token.lockStatus.unlockDate) - (Math.floor(Date.now()/1000));
        if(!(timeToUnlock <= 0)) {
            var timeDiffStr = getTimeDiffReadable( timeToUnlock );
    
            lockIcon.setAttribute('title', "<b>Liquidity locked!</b> <p>Unlocks in: " + timeDiffStr + "</p>");
            var tooltip = new bootstrap.Tooltip(lockIcon);
    
            lockIconLink.appendChild(lockIcon)
            warningCellDiv.appendChild(lockIconLink)
        }

    }

    let date = new Date(parseInt(token.timeDiscovered)*1000);
    dateCell.textContent = date.toLocaleString();
    dateCell.className = 'date';

    lastUpdatedCell.id = `${token.tokenAddress}-last`;
    lastUpdatedCell.className = 'last';
    lastUpdatedCell.lastUpdated = token.lastUpdated;

    lastUpdatedCells.push(lastUpdatedCell);

    holdersCell.className = 'holders;'
    holdersCell.id = `${token.tokenAddress}-holders`;
    holdersCell.textContent = Number(token.holders).toLocaleString();

    let baseCurrencyMultiplier = token.baseCurrencyDecimals * -1;
    var baseValueReadable = (Number(token.pairBaseCurrencyBalance) * Math.pow(10, baseCurrencyMultiplier));
    liqCell.liqValue = baseValueReadable;
    liqText.textContent = baseValueReadable.toFixed(5)
                            + " " + token.baseCurrencyName;

    updateLiqColor( liqCell, baseValueReadable );
    liqCell.appendChild(liqText);

    let swapButtonLink = createButtonLink( token.swapRootUrl + token.tokenAddress, "Swap", "success" );
    swapButtonSpan.appendChild( swapButtonLink );

    let scannerButtonLink = createButtonLink( token.scannerRootUrl + "token/" + token.tokenAddress, "Scan", "link" );
    scannerButtonSpan.appendChild( scannerButtonLink );

    row.appendChild(nameCell);
    warningCell.appendChild(warningCellDiv)
    row.appendChild(warningCell);
    row.appendChild(dateCell);
    dateCell.appendChild(lastUpdatedCell);
    
    row.appendChild(liqCell);
    row.appendChild(holdersCell);
    buttonsCell.appendChild(swapButtonSpan);
    buttonsCell.appendChild(scannerButtonSpan);
    row.appendChild(buttonsCell);

    if( unliquidatedHidden && baseValueReadable < 0.1 ) row.style.display = "none";

    lastUpdatedCell.textContent = getLastUpdatedDifference( lastUpdatedCell, true );
    lastUpdatedCell.timer = setInterval( ()=>{
        lastUpdatedCell.textContent = getLastUpdatedDifference( lastUpdatedCell, true );
    }, 2000 )

    if( isAlreadyAdded ) table.replaceChild( row, oldRow );
}

socket.on('new tokens', function(msg){
    if( msg.length > 0 ){
        var table = document.getElementById('token-table');
        var spinnerRow = document.getElementById('spinner-row')
        if( spinnerRow ){
            table.removeChild(spinnerRow);
        }
    
        for( token of msg ) {
            makeRow( token.value, table );
        }
    }


});

function getLastUpdatedDifference( cell, isInitial ){
    var difference = Number(Date.now()/1000) - Number(cell.lastUpdated);
    var s = "Last updated";
    if( difference < 2 ) {
        cell.parentElement.parentElement.classList.add("table-primary")
        setTimeout(()=>{
            cell.parentElement.parentElement.classList.remove("table-primary");
        }, 500)
        return s + " just now"
    }
    if( difference < 30 ) {
        
        return s + " just now"
    }
    if( difference < 60 ) {
        return s + " less than a minute ago"
    } 
    if( difference < 120 ) return s + " a minute ago"
    if( difference < 3600 ) return `${s} ${Math.floor((difference/60))} minutes ago`
    else return `${s} ${Math.floor((difference/60)/60)} hours ago`
}

socket.on('web console', function(msg){
    var c = document.getElementById("console");
    c.innerHTML += `<p>${msg}</p>`;
})

socket.on('init web console', function(msg){
    var c = document.getElementById("console");
    for( m of msg ){
        c.innerHTML += `<p>${m}</p>`;
    }
})

socket.on('update token', function(msg){
    try{
        var table = document.getElementById('token-table');
        makeRow( msg, table );
        /* console.log(msg);
        var holdersSearchStr = `${msg.tokenAddress}-holders`;
        var holdersCell = document.getElementById( holdersSearchStr );
        holdersCell.textContent = Number(msg.holders).toLocaleString();
    
        var searchStr = `${msg.tokenAddress}-liq`;
        var cell = document.getElementById(searchStr).firstChild;
    
        let baseCurrencyMultiplier = msg.baseCurrencyDecimals * -1;
        var baseValueReadable = (Number(msg.pairBaseCurrencyBalance) * Math.pow(10, baseCurrencyMultiplier));
        cell.textContent = baseValueReadable.toFixed(5)
                                + " " + msg.baseCurrencyName;
        updateLiqColor( cell, baseValueReadable );
    
        let lastUpdatedCell = document.getElementById(`${msg.tokenAddress}-last`);
        lastUpdatedCell.lastUpdated = msg.lastUpdated;
        lastUpdatedCell.textContent = getLastUpdatedDifference( lastUpdatedCell, true );
    
        if( msg.lockStatus ) {
            var lockSearchStr = `${msg.tokenAddress}-lock`;
            var lockIcon = document.getElementById(lockSearchStr);
    
            var timeToUnlock = parseInt(msg.lockStatus.unlockDate) - (Math.floor(Date.now()/1000));
            var timeDiffStr = getTimeDiffReadable( timeToUnlock );
        
            lockIcon.setAttribute('title', "<b>Liquidity locked!</b> <p>Unlocks in: " + timeDiffStr + "</p>");
        } */
    }
    catch(e) {
        console.log(e);
        var x = document.getElementById('tokens') 
        x = document.createElement('div');
        x.textContent = "Whoops! Something went wrong. Please refresh the page."
    }

})


