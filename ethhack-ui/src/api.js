const kInitialTimeout = 15000,
      kMaxTimeout = 60000;

export default class Api {

  static error_handler;

  static set_error_handler(new_error_handler) {
    this.error_handler = new_error_handler;
  }


  static get_votes() {
    let votes = false;
    try {
      votes = JSON.parse(localStorage.getItem('votes'));
      if (Array.isArray(votes)) {
        return votes;
      } 
    } catch(e) {
    }
    return [];
  }

  static set_votes(votes) {
    localStorage.setItem('votes', JSON.stringify(votes));
  }


  //---------------------------------------------------------------------------
  static api_call(url, data, ok_handler, root='/api/') {
    log(url);
    $.ajaxSetup({ cache: false });
    if(location.protocol == 'file:') { // runs on device
      root = 'https://hito.xyz/api/';
    }
    root = './test_api/';

    var error_reload = () => {
      if (this.timeout) {
        this.timeout *= 2;
      } else {
        this.timeout = kInitialTimeout;
      }
      if (this.timeout > kMaxTimeout) {
        this.timeout = kInitialTimeout;
      }
      log('reload "' + root + url + '" after ' + this.timeout + 's');
      setTimeout(() => $.ajax(ajax_params), this.timeout); 
    };
    log(root + url);
    if (!url.endsWith('.json')) {
      url = url + '.json';
    }
    //var cache_key = url + JSON.stringify(data);
    //cache_key = cache_key.replace(new RegExp('[/"{}:]+', 'g'), '_');

    var ajax_params = {
      method: url.endsWith('post') ? 'POST' : 'GET',
      url:    root + url,
      //data:   data,
      cache: false,
      dataType: 'json',
      username: 'my',
      password: 'nigger',
      success: (data) => {
        log(data);
        //if (data.status) {
          //if (data.status == 'ok') {
            //this.timeout = kInitialTimeout;
            //var cache = localStorage.getItem('cache');
            //if (!cache || typeof cache != "object") {
              //cache = {};
            //}
            //log('cache');
            //log(cache);
            //cache[cache_key] = data;
            //localStorage.setItem('cache', data);
            ok_handler(data, true);
          //} else {
            //error_reload();
            //ok_fn(data.status, false);
          //}
        //} else {
				//	error_reload();
          //ok_fn(data.status, false);
        //}
      },
      error: (status) => {
				//error_reload();
        //var cache = localStorage.getItem('cache');
        //if (cache && typeof cache === "object" && cache[cache_key]) {
        //  log('from cache');
        //  ok_handler(cache[cache_key]);
        //  return;
        //}
        if (this.error_handler) {
          this.error_handler('Hito server is not responding');
        } else {
          ok_fn(status, false);
        }
      },
      timeout: this.timeout,
    };

    $.ajax(ajax_params);
  }

}

