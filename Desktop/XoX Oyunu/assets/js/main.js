// DOMContentLoaded olayı gerçekleştiğinde, oyunun başlaması için gerekli değişkenleri ve olay dinleyicilerini tanımlar.
window.addEventListener('DOMContentLoaded', () => {

    // HTML'de "kutu" sınıfına sahip tüm öğeleri seçer ve bunları bir diziye dönüştürür.
    const kutular = Array.from(document.querySelectorAll('.kutu'));

    // HTML'de "goster-oyuncu" sınıfına sahip olan öğeyi seçer.
    const oyuncuGosterim = document.querySelector('.goster-oyuncu');

    // HTML'de id'si "sifirla" olan düğmeyi seçer.
    const sifirlaButonu = document.querySelector('#sifirla');

    // HTML'de "duyurucu" sınıfına sahip olan öğeyi seçer.
    const duyurucu = document.querySelector('.duyurucu');

    let tahta = ['', '', '', '', '', '', '', '', '']; // Tahtayı temsil eden bir dizi oluşturur. Boş hücreler boş dizeyle temsil edilir.
    let suankiOyuncu = 'X';// Oyunun başlangıcında sıranın oyuncu X'de olması için "suankiOyuncu" değişkeni "X" olarak atanır.
    let oyunAktif = true;    // Oyunun aktif durumunu belirlemek için "oyunAktif" değişkeni başlangıçta "true" olarak atanır.

    const OYUNCU_X_KAZANDI = 'Oyuncu X Kazandı';
    const OYUNCU_O_KAZANDI = 'Oyuncu O Kazandı';
    const BERABERE = 'Berabere';
    // Sonuçları belirlemek için sabit değişkenler tanımlanır.

    /*
        Tahtadaki İndeksler
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */

    const kazanmaKosullari = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    // Tahtadaki İndeksler ve Kazanma Koşulları 

    function sonucuDegerlendir() {    // Oyuncunun sonucunu değerlendiren işlev. Kazanan var mı veya berabere mi kontrol eder.
        let kazananVar = false;       // Başlangıçta kazananın olmadığını belirten "kazananVar" değişkeni "false" olarak atanır.
        for (let i = 0; i <= 7; i++) {
            const kazanmaKosulu = kazanmaKosullari[i];
            const a = tahta[kazanmaKosulu[0]];
            const b = tahta[kazanmaKosulu[1]];
            const c = tahta[kazanmaKosulu[2]];
            if (a === '' || b === '' || c === '') {                    // Eğer herhangi bir hücre boşsa, bu kazanma kombinasyonu değerlendirilmez ve bir sonraki kombinasyona geçilir.
                // Eğer herhangi bir hücre boşsa, bu kazanma kombinasyonu değerlendirilmez ve bir sonraki kombinasyona geçilir.

                continue;
            }
            if (a === b && b === c) {
                kazananVar = true;     // Eğer bu kazanma kombinasyonunda aynı değerlere sahip üç hücre varsa, oyuncu kazanmıştır.

                break;
            }
        }

        if (kazananVar) {
            duyur(suankiOyuncu === 'X' ? OYUNCU_X_KAZANDI : OYUNCU_O_KAZANDI);
            oyunAktif = false;
            return;
        }              // Eğer kazanan varsa, kazanan oyuncunun kim olduğuna bağlı olarak bir duyuru yapılır.


        if (!tahta.includes(''))              // Eğer tahta dolu ve kazanan yoksa, oyun berabere sonuçlanmıştır.
            duyur(BERABERE);
    }

    const duyur = (tur) => {           // Sonuçları duyurmak için işlev. Oyuncu X kazandı, oyuncu O kazandı veya berabere mesajlarını görüntüler.

        switch (tur) {
            case OYUNCU_O_KAZANDI:
                duyurucu.innerHTML = 'Oyuncu <span class="oyuncuO">O</span> Kazandı';
                break;
            case OYUNCU_X_KAZANDI:
                duyurucu.innerHTML = 'Oyuncu <span class="oyuncuX">X</span> Kazandı';
                break;
            case BERABERE:
                duyurucu.innerText = 'Berabere';
        }
        duyurucu.classList.remove('gizle');
    };

    const gecerliHareketMi = (kutu) => {               // Geçerli bir hareket mi kontrol eden işlev. Boş hücreler üzerinde oynamanın mümkün olup olmadığını belirler.

        if (kutu.innerText === 'X' || kutu.innerText === 'O') {
            return false;
        }

        return true;
    };

    const tahtayiGuncelle = (index) => {           // Tahtayı güncelleyen işlev. Oyuncunun hamlesini tahtaya işler.

        tahta[index] = suankiOyuncu;
    }

    const oyuncuDegistir = () => {       // Oyuncu değiştiren işlev. Sırayı diğer oyuncuya geçirir.
        oyuncuGosterim.classList.remove(`oyuncu${suankiOyuncu}`);
        suankiOyuncu = suankiOyuncu === 'X' ? 'O' : 'X';
        oyuncuGosterim.innerText = suankiOyuncu;
        oyuncuGosterim.classList.add(`oyuncu${suankiOyuncu}`);
    }

    const kullaniciHareketi = (kutu, index) => {          // Kullanıcının hamlesini işleyen işlev. Geçerli bir hamle yapıldığında tahtayı günceller ve sonucu değerlendirir.

        if (gecerliHareketMi(kutu) && oyunAktif) {
            kutu.innerText = suankiOyuncu;
            kutu.classList.add(`oyuncu${suankiOyuncu}`);
            tahtayiGuncelle(index);
            sonucuDegerlendir();
            oyuncuDegistir();
        }
    }

    const tahtayiSifirla = () => {             // Tahtayı sıfırlayan işlev. Yeni bir oyun için tahtayı başlangıç durumuna getirir.

        tahta = ['', '', '', '', '', '', '', '', ''];
        oyunAktif = true;
        duyurucu.classList.add('gizle');

        if (suankiOyuncu === 'O') {
            oyuncuDegistir();
        }

        kutular.forEach(kutu => {          // Her kutu için bir olay dinleyici ekler ve kullanıcı hareketini işler.

            kutu.innerText = '';
            kutu.classList.remove('oyuncuX');
            kutu.classList.remove('oyuncuO');
        });
    }

    kutular.forEach((kutu, index) => {
        kutu.addEventListener('click', () => kullaniciHareketi(kutu, index));
    });

    sifirlaButonu.addEventListener('click', tahtayiSifirla);
});
    // Sıfırla düğmesine bir olay dinleyici ekler ve tahtayı sıfırlayan işlevi çağırır.
