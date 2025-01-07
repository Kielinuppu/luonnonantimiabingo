let kuvat = [];
let aanet = [];
let arvotut = [];
let maxKuvat = 25;
let aloitusNumero = 1;

const arvottuKuva = document.getElementById('arvottuKuva');
const helppoNappi = document.getElementById('helppoNappi');
const vaikeaNappi = document.getElementById('vaikeaNappi');
const aloitusNappi = document.getElementById('aloitusNappi');
const seuraavaNappi = document.getElementById('seuraavaNappi');
const pelialue = document.getElementById('pelialue');
const vaikeustasoContainer = document.getElementById('vaikeustasoContainer');
const aloitusNappiContainer = document.getElementById('aloitusNappiContainer');
const arvotutKuvatContainer = document.getElementById('arvotutKuvatContainer');
const latausEfekti = document.getElementById('latausEfekti');

let nykyinenAudio = null;
let valittuTaso = null;
const arvontaAudio = new Audio('arvonta.mp3');
const kysymysAudio = new Audio('kysymys.mp3');

// Vaikeustason valinta
helppoNappi.addEventListener('click', () => valitseTaso(9, 0));
vaikeaNappi.addEventListener('click', () => valitseTaso(25, 1));

// Aloitusnapin kuuntelija
aloitusNappi.addEventListener('click', aloitaPeli);
seuraavaNappi.addEventListener('click', aloitaArvonta);

function valitseTaso(kuvamaara, aloitus) {
    maxKuvat = kuvamaara;
    aloitusNumero = aloitus;
    
    // Luodaan kuva- ja äänitiedostojen nimet
    kuvat = Array.from({length: maxKuvat}, (_, i) => `${i + aloitusNumero}.png`);
    aanet = Array.from({length: maxKuvat}, (_, i) => `${i + aloitusNumero}.mp3`);
    
    // Piilotetaan vaikeustasovalikko ja näytetään aloitusnappi
    vaikeustasoContainer.classList.add('hidden');
    aloitusNappiContainer.classList.remove('hidden');
}

function aloitaPeli() {
    // Piilotetaan aloitusnappi ja näytetään pelialue
    aloitusNappiContainer.classList.add('hidden');
    pelialue.classList.remove('hidden');
    
    // Nollataan peli
    arvotut = [];
    arvotutKuvatContainer.innerHTML = '';
    seuraavaNappi.textContent = 'SEURAAVA';
    seuraavaNappi.disabled = false;
    
    // Aloitetaan peli
    aloitaArvonta();
}
function aloitaArvonta() {
    if (seuraavaNappi.textContent === 'VALMIS!') {
        return;
    }

    seuraavaNappi.disabled = true;
    arvottuKuva.classList.add('hidden');
    latausEfekti.classList.remove('hidden');
    
    kysymysAudio.play();

    let seuraavaKuva, arvottuIndeksi;
    
    // Arvo seuraava kuva 2 sekunnin kuluttua
    setTimeout(() => {
        [seuraavaKuva, arvottuIndeksi] = arvoSeuraava();
        if (seuraavaKuva) {
            const imgLoader = new Image();
            imgLoader.src = seuraavaKuva;
        }
    }, 2000);

    // Näytä kuva 3 sekunnin kuluttua
    setTimeout(() => {
        kysymysAudio.pause();
        kysymysAudio.currentTime = 0;
        arvontaAudio.play();
        
        if (seuraavaKuva) {
            arvottuKuva.src = seuraavaKuva;
            arvottuKuva.alt = `Kuva ${arvotut.length}`;
            
            lisaaArvottuKuvake(seuraavaKuva, arvottuIndeksi);
        }
        
        latausEfekti.classList.add('hidden');
        arvottuKuva.classList.remove('hidden');
        
        enlargeImage();
        startStarBurst();
        soitaAudio(nykyinenAudio);
        
        setTimeout(() => {
            shrinkImage();
            if (seuraavaNappi.textContent !== 'VALMIS!') {
                seuraavaNappi.disabled = false;
            }
        }, 5000);
    }, 3000);
}

function arvoSeuraava() {
    // Tarkista onko peli loppumassa
    if (arvotut.length === maxKuvat - 1) {
        seuraavaNappi.textContent = 'VALMIS!';
        seuraavaNappi.disabled = true;
    }

    // Jos kaikki on arvottu, palauta null
    if (arvotut.length === maxKuvat) {
        return [null, null];
    }

    // Arvo uusi kuva
    let arvottuIndeksi;
    do {
        arvottuIndeksi = Math.floor(Math.random() * maxKuvat);
    } while (arvotut.includes(arvottuIndeksi));

    // Tallenna arvottu kuva ja sen ääni
    arvotut.push(arvottuIndeksi);
    const arvottuKohde = kuvat[arvottuIndeksi];
    nykyinenAudio = aanet[arvottuIndeksi];

    return [arvottuKohde, arvottuIndeksi + aloitusNumero];
}

function lisaaArvottuKuvake(kuvaUrl, numero) {
    const kuvake = document.createElement('img');
    kuvake.src = kuvaUrl;
    kuvake.alt = `Arvottu kuva ${numero}`;
    kuvake.className = 'arvottuKuvake';
    kuvake.title = `Kuva ${numero}`;
    arvotutKuvatContainer.appendChild(kuvake);
}

function soitaAudio(audioTiedosto) {
    if (audioTiedosto) {
        const audio = new Audio(audioTiedosto);
        audio.play();
    }
}

function enlargeImage() {
    arvottuKuva.classList.add('active');
    document.body.insertAdjacentHTML('beforeend', '<div class="overlay"></div><div class="star-container"></div>');
    document.querySelector('.overlay').style.display = 'block';
}

function shrinkImage() {
    arvottuKuva.classList.remove('active');
    const overlay = document.querySelector('.overlay');
    const starContainer = document.querySelector('.star-container');
    if (overlay) {
        overlay.style.display = 'none';
        overlay.remove();
    }
    if (starContainer) {
        starContainer.remove();
    }
}

function startStarBurst() {
    createStarBurst();
    const starInterval = setInterval(createStarBurst, 500);
    
    setTimeout(() => {
        clearInterval(starInterval);
    }, 4500);
}

function createStarBurst() {
    const starCount = 20;
    const container = document.querySelector('.star-container');
    const imgRect = arvottuKuva.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const side = Math.floor(Math.random() * 4);
        let startX, startY;

        switch(side) {
            case 0: // ylhäältä
                startX = imgRect.left + Math.random() * imgRect.width;
                startY = imgRect.top;
                break;
            case 1: // oikealta
                startX = imgRect.right;
                startY = imgRect.top + Math.random() * imgRect.height;
                break;
            case 2: // alhaalta
                startX = imgRect.left + Math.random() * imgRect.width;
                startY = imgRect.bottom;
                break;
            case 3: // vasemmalta
                startX = imgRect.left;
                startY = imgRect.top + Math.random() * imgRect.height;
                break;
        }

        star.style.left = `${startX - containerRect.left}px`;
        star.style.top = `${startY - containerRect.top}px`;
        
        const angle = Math.atan2(startY - (imgRect.top + imgRect.height/2), 
                                startX - (imgRect.left + imgRect.width/2));
        const distance = Math.max(containerRect.width, containerRect.height);
        
        star.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        star.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
        
        container.appendChild(star);
    }
}

// Kun taustaa klikataan, suljetaan kuva
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('overlay')) {
        shrinkImage();
        if (nykyinenAudio) {
            const audio = new Audio(nykyinenAudio);
            audio.pause();
            audio.currentTime = 0;
        }
    }
});