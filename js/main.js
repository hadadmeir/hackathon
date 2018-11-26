const AdIT = {
  items: null,
  selectedVideo: null,
  thumbSize: {w: 172, h: 244},
  a: 0,
    set itemsCount(x) {
        this.a++;
        this.buildMiniCart();
    },

    get itemsCount() {
      return this.a;
    },

  canplay: function(ev) {
    document.querySelector('#video').style.display = 'block';
    document.querySelector('#videos').style.display = 'none';

    this.video = document.querySelector('#video');
    videoWidth = this.video.videoWidth;
    videoHeight = this.video.videoHeight;
    this.video.setAttribute('width', videoWidth);
    this.video.setAttribute('height', videoHeight);
    this.video.muted = false;
    this.video.play();
  },

  getItems: function() {
    $.ajax({
      url: 'data/items.json',
      contentType: 'application/json',
      dataType: 'json'
    }).then(this.onGetItemsSuccess.bind(this), this.onGetItemsError.bind(this));
  },

  onGetItemsSuccess: function(result) {
    this.items = {};
    const itemsLength = result.items.length;
    const items = document.createElement('div');

    for (let i = 0; i < itemsLength; i++) {
      const curItem = result.items[i];

      const newItem = document.createElement('div');

      const left = (((i + 1) % 5) * this.thumbSize.w + 40);
      const top = ((Math.ceil((i + 1) / 5) - 1) * 244 + 20);

      newItem.onmouseover = this.onMovieOver.bind(this);
      newItem.onmouseout = this.onMovieOut.bind(this);
      newItem.style.backgroundImage = ('url(' + curItem.thumb + ')');
      newItem.style.width = (this.thumbSize.w + 'px');
      newItem.style.height = (this.thumbSize.h + 'px');

      newItem.setAttribute('id', 'movie_' + curItem.id);
      newItem.setAttribute('class', 'videoItem');

      newItem.style.left = left + 'px';
      newItem.style.top = top + 'px';

      newItem.addEventListener('click', this.startVideo.bind(this), false);

      curItem.pos = {top, left};
      this.items[curItem.id] = curItem;

      items.appendChild(newItem);
    }
    document.querySelector('#videos').appendChild(items);
  },

  onMovieOver: function (event) {
    const el = event.target;
    const movieId = el.id.replace('movie_', '');
    const item = this.items[movieId];
    if (el.id.indexOf('movie_') === 0 && !item.block) {
      this.items[movieId].block = true;

      $(el).animate({
        top: (item.pos.top - 10) + 'px',
        left: (item.pos.left - 10) + 'px',
        width: (this.thumbSize.w + 40) + 'px',
        height: (this.thumbSize.h + 40) + 'px'
      }, 120).css('zIndex', 2);
    }
  },

  onMovieOut: function (event) {
    const el = event.target;
    const movieId = el.id.replace('movie_', '');
    const item = this.items[movieId];
    if (el.id.indexOf('movie_') === 0) {
      el.style.zIndex = 1;
      $(el).animate({
        top: (item.pos.top + 10) + 'px',
        left: (item.pos.left + 10) + 'px',
        width: this.thumbSize.w + 'px',
        height: this.thumbSize.h + 'px'
      }, 120, () => {
        item.block = false;
      });
    }
  },

  onGetItemsError: function() {},

  startVideo: function(e) {
    const id = e.target.id.replace('movie_', '');
    this.selectedVideo = this.items[id];
    document.querySelector('#video').src = this.items[id].video;
  },

  showAd: function() {
    this.video.pause();
    document.querySelector('#adInfo').style.display = 'block';
    document.querySelector('#adInfo').innerHTML = '<h1>' + this.selectedVideo.title + '</h1>';
  },

  fetchCart: function() {
    console.log('in fetchCart');
      $.ajax({
          url: 'data/cartItems.json',
          contentType: 'application/json',
          dataType: 'json'
      }).then(this.onFetchCartSuccess.bind(this), this.onFetchCartError.bind(this));
  },

  onFetchCartSuccess: function(result) {
      console.log('in fetchCartSuccess');
      this.cartItems = [];
      const itemsLength = result.length;
      const items = document.createElement('div');

      for (let i = 0; i < itemsLength; i++) {
          const curItem = result[i];
          this.cartItems.push(curItem.id);

          const newItem = document.createElement('iframe');
          newItem.setAttribute('src', curItem.src);
          newItem.setAttribute('id', curItem.id);
          newItem.setAttribute('class', 'cartItemIframe');
          newItem.setAttribute('style', 'width:100px');
          items.appendChild(newItem);
      }
      document.querySelector('#cartItems').appendChild(items);
     // this.showMiniCart();
  },

  addCSStoIframe: function(iframe) {
    const iframeIds = this.cartItems;
    const iframeIdsLength = iframeIds.length;
    for (let i = 0; i < iframeIdsLength; i++) {
        let cssLink = document.createElement("link");
        cssLink.href = "css/style.css";
        cssLink .rel = "stylesheet";
        cssLink .type = "text/css";
        if (document.getElementById(iframeIds[i]).contentDocument) {
            document.getElementById(iframeIds[i]).contentDocument.head.appendChild(cssLink);
        }
    }
  },

  onFetchCartError: function() {
      console.log('in fetchCartFailure');
  },

  showMiniCart: function() {
    const addedToBagDialogue = document.querySelector('#addedToBagDialogue');
    if (addedToBagDialogue.classList.contains("nextDisplayNone")) {
        this.video.pause();
        this.fetchCart();
      //  this.addCSStoIframe();
        addedToBagDialogue.classList.remove('nextDisplayNone');
    } else {
        addedToBagDialogue.classList.add('nextDisplayNone');
        this.video.play();
    }
  },

  buildMiniCart: function () {
      const itemsCount = this.itemsCount;
     /* const itemsCountDiv = document.createElement('div');
      itemsCountDiv.setAttribute("class","items_count");
      itemsCountDiv.textContent = itemsCount + " items in your cart";
      document.querySelector('#bagHeader').appendChild(itemsCountDiv);*/
      document.querySelector('#bagHeader').innerHTML = itemsCount + " items in your cart";

      if (itemsCount > 0) {
          document.querySelector('#icon').classList.remove('Icon');
          document.querySelector('#icon').classList.add('Icon-active');
      }
      document.querySelector('#itemCountSpanId').innerHTML = itemsCount;
  },

  addItemToCart: function () {
      this.itemsCount = this.itemsCount+1;
  },
};

$(document).ready(() => {

  document.querySelector('#bagSummary').onclick = AdIT.showMiniCart.bind(AdIT);

  document.querySelector('#video').onloadeddata = AdIT.canplay.bind(AdIT);
  document.querySelector('#video').onclick = AdIT.addItemToCart.bind(AdIT);
  AdIT.getItems.bind(AdIT);
  AdIT.fetchCart.bind(AdIT);
  AdIT.showMiniCart.bind(AdIT);
  //AdIT.addCSStoIframe.bind(AdIT);
  AdIT.getItems();
  AdIT.buildMiniCart();
    //AdIT.watch('itemsCount', AdIT.buildMiniCart.bind(AdIT));
    //AdIT.addEventListener("change", AdIT.buildMiniCart.bind(AdIT));
  //AdIT.itemsCount.onchange=AdIT.buildMiniCart.bind(AdIT);
});
