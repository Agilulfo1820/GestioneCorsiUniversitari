// MetaMask injects the web3 library for us.
window.addEventListener('load', function () {
    var web3 = window.web3;
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
        console.log("Connected to Metamask");
    } else {
        console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    }

    web3.version.getNetwork((err, netId) => {
        console.log(netId);
        switch (netId) {
            case "1":
                console.log('This is mainnet')
                break
            case "3":
                console.log('This is the ropsten test network.')
                break
            default:
                console.log('This is an unknown network.')
        }
    })

    var ABI = [{ "constant": true, "inputs": [], "name": "numCorso", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "vediCorsi", "outputs": [{ "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_corsoId", "type": "uint256" }], "name": "controllaCompletamentoIscrizioni", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_corsoId", "type": "uint256" }], "name": "vediIndirizziIscrittiAlCorso", "outputs": [{ "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "IdentificativoCorso", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_corsoId", "type": "uint256" }], "name": "vediCorso", "outputs": [{ "name": "", "type": "string" }, { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_nomeCorso", "type": "string" }, { "name": "_nomeRelatore", "type": "string" }, { "name": "_maxNumIscritti", "type": "uint256" }, { "name": "_prezzo", "type": "uint256" }, { "name": "_beneficiario", "type": "address" }], "name": "creaCorso", "outputs": [{ "name": "corsoId", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_corsoId", "type": "uint256" }, { "name": "_addressStudente", "type": "address" }], "name": "vediStudentiIscrittiAlCorso", "outputs": [{ "name": "", "type": "string" }, { "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "contoCorsi", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_corsoId", "type": "uint256" }, { "name": "_nomeIscritto", "type": "string" }, { "name": "_matricola", "type": "uint256" }], "name": "iscriviAlCorso", "outputs": [{ "name": "", "type": "bool" }], "payable": true, "stateMutability": "payable", "type": "function" }];
    var ContractAddress = '0x1061FE2Da8F6fCd7D6386DcB56ED5F08bD89b732';

    var GestioneCorsiUniversitari = web3.eth.contract(ABI).at(ContractAddress);

    console.log(GestioneCorsiUniversitari);

    $("#creaCorso").click(function () {
        GestioneCorsiUniversitari.creaCorso($("#nomeCorso").val(), $("#nomeRelatore").val(), $("#maxNumIscritti").val(), $("#prezzo").val(), $("#beneficiario").val(), function (error, result) {
            if (!error) {
                console.log(result);
            } else {
                console.log(error);
            }
        }
        )
    })

    GestioneCorsiUniversitari.vediCorsi(function (error, result) {
        if (!error) {
            console.log(result)


            result.forEach(function (corsoId) {
                GestioneCorsiUniversitari.vediCorso(corsoId, function (error, result) {
                    if (!error) {
                        console.log(result)
                        
                        $("#elencoCorsi").append("<table><tr><td>Nome corso</td><td>" + result[0] +"</td></tr><tr><td>Relatore</td><td>" + result[1] + "</td></tr><tr><td>Iscritti</td><td>" + result[2] + "</td></tr><tr><td>Iscrizioni massime</td><td>" + result[3] + "</td></tr></table>");
                    } else {
                        
                    }
                });

            });


        } else {
            console.log(error);
        }
    })



});