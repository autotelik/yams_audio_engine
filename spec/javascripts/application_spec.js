//= require audio_engine

describe("When the library in loaded", function() {
  it("should have nullified basic variables", function() {
    expect(jQuery).toBeDefined();
    expect(datashift_audio_engine).toBeDefined();
  });

  it("should have nullified basic properties of  datashift audio engine", function() {
    expect(datashift_audio_engine.state).toBe(null);
    expect(datashift_audio_engine.engine).toBe(null);

    expect(datashift_audio_engine.save_interval).toBe(1000);
    expect(datashift_audio_engine.is_radio).toBe(false);

    expect(datashift_audio_engine.routes.init_url).toBe(null);
    expect(datashift_audio_engine.routes.load_url).toBe(null);
    expect(datashift_audio_engine.routes.save_url).toBe(null);
    expect(datashift_audio_engine.routes.load_url).toBe(null);

    expect(datashift_audio_engine.settings.autoplay).toBe(false);
    expect(datashift_audio_engine.settings.random).toBe(false);
    expect(datashift_audio_engine.settings.repeat).toBe(null);
    expect(datashift_audio_engine.settings.volume).toBe(1);

    expect(datashift_audio_engine.user_token).toBe(null);
    expect(datashift_audio_engine.client_token).toBe(null);

    expect(datashift_audio_engine.playlist_id).toBe(0);
    expect(datashift_audio_engine.timer).toBe(null);
  });

  it("should be avaliabled support function foratTime and work fine", function(){
    expect(formatTime).toBeDefined();

    var time_in_seconds = 144;
    var time_in_cute_form = '02:24';
    expect(formatTime(time_in_seconds)).toEqual(time_in_cute_form);
  });
});

describe("When the library is settings are OK", function(){
  // save current state
  it('save current state', function(){
    //init
    //load
    //render
    // datashift_audio_engine.save_current_state();
  });

  // init
  it('should be initialized by data that obtained through ajax request', function(){
    datashift_audio_engine.init('/init');
    expect(datashift_audio_engine.state).toBe('sent init request');
  });

  it('should be inited without ajax request to server' ,function() {
    var spy_on_init = spyOn(datashift_audio_engine, 'init');
    var spy_on_ajax_init = spyOn($, 'ajax');

    datashift_audio_engine.init();

    expect(spy_on_init).toHaveBeenCalled();
    expect(spy_on_ajax_init).not.toHaveBeenCalled()
  });

  // load
  it('should load test data from list', function(){
    datashift_audio_engine.init();

    all_elements = $('<div id="datashift-audio-player" class="datashift-audio-player"> \
                        <div id="waveform"></div>  \
                      </div> \
                      <div id="datashift-audio-playlist"></div>');
    $(document.body).append(all_elements);

    datashift_audio_engine.load();
    expect(datashift_audio_engine.state).toBe('sent load request');
  });

  // update info
  it('update info', function(){
    datashift_audio_engine.init();
    var spy_on_update_info = spyOn(datashift_audio_engine, 'update_info');
    // datashift_audio_engine.load();
    datashift_audio_engine.update_info();
    expect(spy_on_update_info).toHaveBeenCalled();
  });
});