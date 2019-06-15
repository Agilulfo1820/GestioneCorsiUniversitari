pragma solidity ^0.5.0;

contract GestioneCorsiUniversitari {
    
    struct Studente{
        string nomeIscritto;
        uint matricola;
    }
    
    struct Corso {
        string nomeCorso;
        string nomeRelatore;
        uint numIscritti;
        uint maxNumIscritti;
        uint prezzo;
        address payable beneficiario;
        mapping (address => Studente) iscritti;
        address[] iscrittiAddrs;
    }
    
    mapping (uint => Corso) corsi;
    uint[] public IdentificativoCorso;
    
    uint public numCorso;
    
    //creare dei corsi 
    function creaCorso(string memory _nomeCorso, string memory _nomeRelatore, uint _maxNumIscritti, uint _prezzo, address payable _beneficiario) public returns (uint corsoId){
        //controlla che parametri != null
        
        corsoId = numCorso++;
        
        Corso storage nuovoCorso = corsi[corsoId];
        
        nuovoCorso.nomeCorso=_nomeCorso;
        nuovoCorso.nomeRelatore = _nomeRelatore;
        nuovoCorso.maxNumIscritti = _maxNumIscritti;
        nuovoCorso.prezzo = _prezzo;
        nuovoCorso.beneficiario = _beneficiario;
        
        IdentificativoCorso.push(corsoId) - 1;
    }
    
    //vedere i corsi
    function vediCorsi() view public returns (uint[] memory) {
        return IdentificativoCorso;
    }
    
    
    function vediCorso(uint _corsoId) view public returns(string memory, string memory, uint, uint){
        //aggiungi gli altri campi da vedere
        return (corsi[_corsoId].nomeCorso, corsi[_corsoId].nomeRelatore, corsi[_corsoId].numIscritti, corsi[_corsoId].maxNumIscritti);
    }
    
    function contoCorsi() view public returns (uint) {
        return IdentificativoCorso.length;
    }
    //gli studenti si possono iscrivere
    function iscriviAlCorso(uint _corsoId, string memory _nomeIscritto, uint _matricola) public payable returns(bool){
        //creare un istanza di Iscritto 
        require(corsi[_corsoId].numIscritti!=corsi[_corsoId].maxNumIscritti);
        require(corsi[_corsoId].iscritti[msg.sender].matricola!=_matricola);
        require(msg.value >= corsi[_corsoId].prezzo);
        
        Studente storage nuovoIscritto = corsi[_corsoId].iscritti[msg.sender];
        
        nuovoIscritto.nomeIscritto = _nomeIscritto;
        nuovoIscritto.matricola = _matricola;
        
        corsi[_corsoId].iscrittiAddrs.push(msg.sender) -1;
        
        corsi[_corsoId].numIscritti++;
        
        return true;
    }
    
    
    function vediIndirizziIscrittiAlCorso(uint _corsoId) view public returns(address[] memory){
        return corsi[_corsoId].iscrittiAddrs;
    }
    
    function vediStudentiIscrittiAlCorso(uint _corsoId, address _addressStudente) view public returns (string memory,uint){
        return (
            corsi[_corsoId].iscritti[_addressStudente].nomeIscritto,
            corsi[_corsoId].iscritti[_addressStudente].matricola
        );
    }
    
    //una volta raggiunto il limite massimo dei posti liberi nessuno si deve più poter iscrivere
    function controllaCompletamentoIscrizioni(uint _corsoId) public returns(bool){
        if(corsi[_corsoId].numIscritti!=corsi[_corsoId].maxNumIscritti){
            return false;
        }
        
        uint sommaDaTrasferire =  corsi[_corsoId].numIscritti * corsi[_corsoId].prezzo;
        
        corsi[_corsoId].beneficiario.transfer(sommaDaTrasferire);
        return true;
    }
}