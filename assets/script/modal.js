Element.prototype.showModal = function(queryModal, queryBtn, queryHeading, queryTexts ,heading, texts){
    var modal = document.querySelector(queryModal);
    var btn = document.querySelector(queryBtn);
    var headingElement = document.querySelector(queryHeading);
    var textsElement = document.querySelector(queryTexts)
    modal.style.display = 'flex';
    btn.addEventListener('click',function(e){
        modal.style.display = 'none'
    })
    headingElement.textContent = heading
    textsElement.innerHTML = ''
    texts.forEach(function(value){
        textsElement.innerHTML += ' - ' + value + '<br>'
    })
    modal.addEventListener('click', function(e){
        if (e.target === modal){
            modal.style.display = 'none'
        }
    })
}
function showImg(querySelectors, modalSelector, imgCss, queryBtn, downloadSelector){
    var imgElements = document.querySelectorAll(querySelectors)
    var btn = document.querySelector(queryBtn);
    var modal = document.querySelector(modalSelector);
    var img = document.querySelector(imgCss)
    var downloadBtn = document.querySelector(downloadSelector)
    Array.from(imgElements).forEach(function(imgElement){
        imgElement.addEventListener('click', function(e){
            modal.style.display = 'flex'
            img.src = this.src
            downloadBtn.download = 'download'
            downloadBtn.href = this.src
        })
    })
    btn.addEventListener('click', function(e){
        modal.style.display = 'none'
    })
    modal.addEventListener('click', function(e){
        if (e.target === modal){
            modal.style.display = 'none'
        }
    })
}