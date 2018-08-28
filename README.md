# Datashift Audio Engine

Audio player for Rails apps.


## Installation
Add this line to your application's Gemfile:

```ruby
gem 'datashift_audio_engine'
```

And then execute:
```bash
$ bundle
```

Or install it yourself as:
```bash
$ gem install datashift_audio_engine
```

### <a name="Configuration">Configuration</a>

Configuration of datashift audio engine can be done through a typical Rails initialiser under config.
The easiest way to create this global configuration file, is to run our rail's install generator : 

```bash
rails g datashift_audio_engine:install
```

### Including assets to project

In `application.js` add

```js
//= require datashift_audio_engine/application
```

In `application.css` add

```css
/*
 *= require datashift_audio_engine/application
 */
```

Or in `application.css` add

```css
/*
 *= require datashift_audio_engine/cover
 *= require datashift_audio_engine/icons
 *= require datashift_audio_engine/playlist
 *= require datashift_audio_engine/volume
 *= require datashift_audio_engine/player
 */
```

## Usage

### Adding a Player

#### Views - HTML Markup and CSS

- full width, track with waveform style (example, see sound cloud)

- embedded button with on hover appearance/play (example, see emusic.com)

- single thin banner for radio or linked to embedded button (example, see mixcloud, soundcloud)

##### ERB - HTML

 @Sloboda  Is this correct HTML for adding the full waveform player to any particular view -
 
 #TODO - Is this is a shared partial ? It should be

```
<div id="datashift-audio-player" class="col-12 datashift-audio-player pt-2 pb-2">

  <div class="row">

    <div class="col-1">
      <div class="datashift-audio-track-cover">
        <i class="material-icons datashift-audio-cover-play play" >play_circle_outline</i>
        <i class="material-icons datashift-audio-cover-play pause datashift-audio-hide">pause_circle_outline</i>
      </div>
    </div>

    <div class="col-1">
      <div class="datashift-audio-track-basic-info text-small">
        <div class="datashift-audio-track-name">Current Track Name</div>
        <div class="datashift-audio-author-name">Author Name</div>
      </div>
    </div>

    <div class="col-9">
      <div class="row">
        <div class="datashift-audio-wave-block col-12" id="waveform"></div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="row">
            <div class="datashift-audio-current-position col-11 text-sm-left">00:00</div>
            <div class="datashift-audio-total-duration col-1 text-sm-right pull-right">00:00</div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-1 datashift-audio-track-volume p-0 pull-right">
      <input type="range" orient="vertical" min="0" max="100" value="100" step="1" class="datashift-audio-input-range" />
      <i class="material-icons volume_up">volume_up</i>
      <i class="material-icons volume_down datashift-audio-hide">volume_down</i>
      <i class="material-icons volume_mute datashift-audio-hide">volume_mute</i>
      <i class="material-icons volume_off  datashift-audio-hide">volume_off</i>
    </div>
  </div>

  <hr>

  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-1 track-playlist">
          <i class="material-icons view_list active">view_list</i>
        </div>
        <div class="col-8">
          <div class=" playlist-content p-1">
            <ol class="datashift-audio-playlist p-1"></ol>
            <div class="datashift-audio-page-selectors">
              <ol class='datashift-audio-pages'></ol>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

</div>
```

#### @Sloboda  What is the HTML for adding the embedded button with on hover appearance player to any particular view - can you  document what CSS can be used to change look and feel of the player ?

#### @Sloboda  What is the HTML for adding the single thin banner player to any particular view - can you  document what CSS can be used to change look and feel of the player ?

#### @Sloboda  - Is the main target for the player a div ALWAYS with id="datashift-audio-player"  regardless of Player Type

#### @Sloboda  - Is this the way to load track data regardless of whether player is full width, hover button, thin main  player ?
 
Now create a Javascript snippet as follows, using the load function to call your Rails route and return the playlist JSON

```
<script type="text/javascript" charset="utf-8">
    $(document).ready(function(){
        datashift_audio_engine.init();

        datashift_audio_engine.load('<%= radio_index_url %>.json');
    });
</script>
```

#### Rails- routes and actions

@Sloboda - I don't thoink thios worlks as you docuemneted ? I did not see any way to set these two. I have added save_url myself to gem

=begin Original README

     init_url: 'init',
     save_url: 'save',
            
Routes
    =
    initialization: ```'init'```
    
    load: ```'playlist/:id.new_page'```
    
    radio_stream: ```'radio_data'```
    
    save current state: ```'save'```
    
    
    setup routes
    ===
    
    u can do it in current version of lib
    just by setting
    
    ```javascript
    datashift_audio_engine.routes = {
            init_url: 'init',
            save_url: 'save',
    
            radio_url: 'radio_data'
    };
    ```
   
    or separate
    ======
    
    ```javascript
        datashift_audio_engine.routes.init_url = 'init';
        datashift_audio_engine.routes.save_url = 'save';
        datashift_audio_engine.routes.radio_url = 'radio_data';
    ```
    
    **routes for load should be set up on load phace manualy**
=end
    
Create a POST ?? route that satisfies the radio_index_url used to create the javascript snippet, and 
that will return the JSON playlist data.

  post 'radio', to: 'radio#index'

Now we can access route helper : radio_url

Sample snippet for creating the JSON playlist :

```ruby
  respond_to do |format|
     format.js   { render  json: {
        tracks: [
          {
              id: @track.id,
              author: 'aqwan',
              name: @track.title,
              audio_url: @track.audio.url(@track.audio.default_style, timestamp: false),
              cover_image: @track.cover_image,
              duration: 100
          }
        ]
      }.to_json }
    end
```
    
#### Javascript methods and call-backs

Each callback should be related to a route in the main Rails app side, connected to a suitable
controller method that can parse or store the supplied  data.

##### Save Callback

When playing a track the player can send back information such as current state of player and playlist, to the server via a save callback

Info could be stored in session or in a DB table connected with User on BE side.

The host app needs to setup client tokens ? https://github.com/waiting-for-dev/devise-jwt


    it calls:
        a) interval is configurable via datashift_audio.save_interval = 1000; // in milliseconds
        
@Sloboda - How to pass such configuration from the Ruby world to the Javascript world ?

        b) player finished to play current track
        c) on pause() click
        d) on previous() click
        e) on next() click
        f) on seek() of track

@Sloboda - What is this url and is this really the save callback json ?

Possible url structure 'user/set_state'

```
    request: {
            user_token
            client_token
            random
            audio_data: {
                service: {
                    user_token: '1234567890',
                    client_token: '0987654321',
                },
        
                audio_player: {
                    autoplay: false,
                    random: false,
                    repeat: null,
                    volume: 1,
                },
        
                audio: {
                    playlist: 'id',
                    
                    page: '1',
                    total_pages: '3',
                    
                    track: 0,
                    position: 0,
                }
            }
    }
```
    expected strucuture of answer: 200 OK, or any error code u like
    
init -     it sends request during datashift_audio_engine.init() function

    call once when we need to sync basic player settings

    possible url structure 'user/get_state'
    
    it sends local variables of {user_token} and {client_token}
    and should obtain JSON with sync data of player
    The structure of answer is:

    {
       saved: {
        service: {
            user_token: '1234567890',
            client_token: '0987654321',
        },

        audio_player: {
            autoplay: false,
            random: false,
            repeat: null,
            volume: 1,
        },

        audio: {
            playlist: 'id',
            
            page: '1',
            total_pages: '3',
            
            track: 0,
            position: 0,
        }
       }    
    }

load -     it sends url and post characteristics of searchable playlist
    
    call once when we need to load playlist and set it into basic state on first open

    possible url structure 'playlist/:id.page' or 'audio/:id'

    request: { user_token, client_token, random }
    expected strucuture of answer:

    {
        user_token: '1234567890',
        client_token: '0987654321',

        playlist: '0',

        page: '1',
        total_pages: '3',

        track: '0',
        position: '0',

        tracks: [
        {
            id: '1',

            author: 'Full Name 1',
            name: 'First Track Name',

            cover_image: 'http://localhost:3000/images/1.jpeg',
            audio_url: 'http://localhost:3000/audio/1.mp3',

            duration: 100,
        },

        {
            id: '2',
        
            author: 'Full Name 2',
            name: 'Second Track Name',

            cover_image: 'http://localhost:3000/images/2.jpeg',
            audio_url: 'http://localhost:3000/audio/2.mp3',

            duration: 100,
        },

        {
            id: '3',
        
            author: 'Full Name 3',
            name: 'Third Track Name',

            cover_image: 'http://localhost:3000/images/3.jpeg',
            audio_url: 'http://localhost:3000/audio/3.mp3',

            duration: 100,
        }
        ],
    }

new_page -    it sends url and post characteristics of searchable playlist
    
        it calls when we need to load new page (manualy or automaticaly when page of
        audios is ends) and updates playlist accordingly to flow

        possible url structure 'playlist/:id.page'

        request: url only
        expected strucuture of answer:

        {
            page: '2',

            tracks: [
                {
                    id: '1',

                    author: 'Full Name 1',
                    name: 'First Track Name',

                    cover_image: 'http://localhost:3000/images/1.jpeg',
                    audio_url: 'http://localhost:3000/audio/1.mp3',

                    duration: 100,
                },

                {
                    id: '2',
                
                    author: 'Full Name 2',
                    name: 'Second Track Name',

                    cover_image: 'http://localhost:3000/images/2.jpeg',
                    audio_url: 'http://localhost:3000/audio/2.mp3',

                    duration: 100,
                },

                {
                    id: '3',
                
                    author: 'Full Name 3',
                    name: 'Third Track Name',

                    cover_image: 'http://localhost:3000/images/3.jpeg',
                    audio_url: 'http://localhost:3000/audio/3.mp3',

                    duration: 100,
                }
                ],
        }



radio -    it gets description of current radio state

    it calls each second during radio playing
    
    possible url structure 'radio/:id'

    request: { radio_url }

    expected strucuture of answer:

    radio: {
        radio_url: 'http://air2.radiorecord.ru:805/rr_320',
        
        author: 'Full Name 3',
        track: 'Third Track Name',

        cover_image: 'http://localhost:3000/images/1.jpeg',
        audio_url: 'http://localhost:3000/audio/1.mp3',
        
        duration: 100,
        position: 0,
        },


How to make list own list of audio tracks?

1. Get JSON list of tracks from BE
2. Create place and styles for items of tracks with squere look like in MixCloud but without inner items
3. Create items based on JSON list of tracks
4. Hang callbacks on items for play and pause btns
    This callbacks should set state of datashif_audio.audio_data.track to id of selected one
    set autoplay to true and call render_wave_from_audio_file() method to render player with selected audio
    
##### Styling - CSS

@Sloboda How to style the player - What are the key CSS classes to change look and feel of the player ?

CSS classes are available to place the player at the `top` or `bottom` of the page ???    
    
#### ORIGINAL README
    
Routes
    =
    initialization: ```'init'```
    
    load: ```'playlist/:id.new_page'```
    
    radio_stream: ```'radio_data'```
    
    save current state: ```'save'```
    
    
    setup routes
    ===
    
    u can do it in current version of lib
    just by setting
    
    ```javascript
    datashift_audio_engine.routes = {
            init_url: 'init',
            save_url: 'save',
    
            radio_url: 'radio_data'
    };
    ```
    
    or separate
    ======
    
    ```javascript
        datashift_audio_engine.routes.init_url = 'init';
        datashift_audio_engine.routes.save_url = 'save';
        datashift_audio_engine.routes.radio_url = 'radio_data';
    ```
    
    **routes for load should be set up on load phace manualy**
    
    JSON format
    =
    
    for initialization
    ===
    
    request:
    
    ```
        {
            user_token: 'asdf1234',
            client_token: '4321fdsa'
    
            random: true,
            audio_data: {
                
            },
        }
    ```
    
    answer example:
    
    ```
        {
            saved: {
                service: {
                    user_token: '1234567890',
                    client_token: '0987654321',
                },
    
                audio: {
                    playlist: '1',
                    
                    page: '1',
                    total_pages: '3',
                    
                    track: 0,
                    position: 0,
                }
            },
        }
    ```
    
    for load
    ===
    
    request:
    
    url: ``` 'playlist/:id.new_page' ```
    
    ```playlist``` - playlist controller route name
    
    ```/:id``` - ID of loadable playlist
    
    ```.new_page``` - number of tracks page in this playlist for load
    
    ```
        {
            user_token: 'asdf1234',
            client_token: '4321fdsa',
    
            random: true
        }
    ```
    
    answer example:
    
    ```
        {
            playlist: 1
            total_pages: 3,
            
            page: 1,
            track: 1,
            position: 0,
    
            tracks: [
                {
                    id: 1,
    
                    author: 'Full Name',
                    name: 'First Track Name',
    
                    cover_image: 'http://localhost:3000/images/1.jpeg',
                    audio_url: 'http://localhost:3000/audio/1.mp3',
    
                    duration: 100,
                },
            ]
        }
    ```
    
    for radio
    ===
    
    request:
    
    url: ``` 'radio_data' ```
    
    ```
        {
            user_token: 'asdf1234',
            client_token: '4321fdsa',
        }
    ```
    
    answer example:
    
    ```
        {
            radio: {
                radio_url: 'http://air2.radiorecord.ru:805/rr_320',
                
                author: 'Full Name 3',
                track: 'Third Track Name',
    
                cover_image: 'http://localhost:3000/images/1.jpeg',
                audio_url: 'http://localhost:3000/audio/1.mp3',
                
                duration: 100,
                position: 0,            
            },
        }
        
    ```
    
for save
===
    
    request:
    
```
        {
            user_token: 'asdf1234',
            client_token: '4321fdsa'
    
            random: true,
    
            audio_data: {
                    playlist: '1',
                    
                    page: '1',
                    total_pages: '3',
                    
                    track: 1,
                    position: 55.5,
            }
        }
```
    
    answer example:
    
```
        {
            status: 200
        }
```





## Contributing
Contribution directions go here.

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
