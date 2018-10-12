# Datashift Audio Engine

Audio player for Rails apps.

## How to install?
Add to Gemfile:

```ruby
gem 'datashift_audio_engine'
```

Add to application javascript file

```javascript
//= require datashift_audio_engine/application
```

Add to application style file

```css
/*
 *= require datashift_audio_engine/application
 */
```

Or

```css
/*
 *= require datashift_audio_engine/cover
 *= require datashift_audio_engine/icons
 *= require datashift_audio_engine/playlist
 *= require datashift_audio_engine/volume
 *= require datashift_audio_engine/player
 */
```

And then execute:
```bash
$ bundle install
```

and 

```bash
bundle exec rails generate datashift_audio_engine:install
```

AND

Add helper to the radio view

```erb
<%= datashift_audio_player_tag %>
```

and now 
create a Javascript snippet as follows, using the load function 
to call your Rails route and return the playlist JSON

```javascript
$(document).ready(function(){
    datashift_audio_engine.init();
    datashift_audio_engine.load();
});
```

## How to configure?

```
state           - current state of player
engine          - variable where will be spawned wave player

is_radio        - true .. false
save_interval   - in milliseconds

routes.
    init_url    - url of action wich will authorize user and will load personalized 
                  information about player right for current user
    load_url    - url of action wich will form playlist load action with params
    save_url    - url of action wich will controll save action
    radio_url   - url of action wich will controll save action
    
settings.
    autoplay    - true .. false
    random      - true .. false
    repeat      - true .. false
    volume      - 0 .. 1
    
waveform_colors.
    wave_color          - regular css colors
    progress_color      - regular css colors
    cursor_color        - regular css colors
    bar_width           - width in pixels
    
playlist_id     - id of selected playlist
playlist:   {}  - content of playlist

audio_data: {}  - main storage of current state of player
    visual: {}  - interface for interation with all visual elements connected with
                  this player
        
timer           - variable for management of regular actions ( save )
```

# Javascript methods and call-backs

Each callback should be related to a route in the main Rails app side, connected to a suitable
controller method that can parse or store the supplied  data.

## How to init?

```
init -  it sends request during 
        datashift_audio_engine.init() function call once 
        when we need to sync basic player settings possible 
        url structure 'user/get_state'
        it sends local variables of {user_token} and {client_token}
        and should obtain JSON with sync data of player
        The structure of answer is:
```

```
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
```

## How to load?

```
load - it sends url and post characteristics of searchable playlist
       call once when we need to load playlist and set it into basic state on first open
       possible url structure 'playlist/:id.page' or 'audio/:id'
       request: { user_token, client_token, random }
       expected strucuture of answer:
```
    
```
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
```

## How to get/set state (save)?
structure of user state

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

## How to do pagination?

```
new_page -      it sends url and post characteristics of searchable playlist
                it calls when we need to load new page (manualy or automaticaly when page of
                audios is ends) and updates playlist accordingly to flow
                possible url structure 'playlist/:id.page'
                request: url only
                expected strucuture of answer:
```
                    
```
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
```

## How to get stream radio?

```
radio -   it gets description of current radio state
          it calls each second during radio playing
          possible url structure 'radio/:id'
          request: { radio_url }
          expected strucuture of answer:
```

```
    radio: {
        radio_url: 'http://air2.radiorecord.ru:805/rr_320',
        
        author: 'Full Name 3',
        track: 'Third Track Name',

        cover_image: 'http://link.to/images/1.jpeg',
        audio_url: 'http://link.to/audio/1.mp3',
        
        duration: 100,
        position: 0,
    },
```

## How to pin to top/bottom?

default value is TOP

```
<%= datashift_audio_player_tag(pin_to: :top) %>
```

or 

```
<%= datashift_audio_player_tag(pin_to: :bottom) %>
```


#### How to modify js/css?

## How to make list own list of audio tracks?

1. Get JSON list of tracks from Back-End
2. Go through player instalation
3. Create items based on JSON list of tracks
4. Hang callbacks on items for play and pause btns
    This callbacks should set state of datashif_audio.audio_data.track to id of selected one
    set autoplay to true and call ```render_wave_from_audio_file()``` method to render player with selected audio
    

#### Views - HTML Markup and CSS

- full width, track with waveform style (example, see sound cloud)

- embedded button with on hover appearance/play (example, see emusic.com)

- single thin banner for radio or linked to embedded button (example, see mixcloud, soundcloud)

#### @Sloboda  What is the HTML for adding the embedded button with on hover appearance player to any particular view - can you  document what CSS can be used to change look and feel of the player ?
#### Answer - 
```
<div class="datashift-audio-player">
  <div class="datashift-audio-track-cover">
    <i class="material-icons datashift-audio-cover-play play" >play_circle_outline</i>
    <i class="material-icons datashift-audio-cover-play pause datashift-audio-hide">pause_circle_outline</i>
  </div>
</div>
```

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

##### Save Callback

When playing a track the player can send back information such as current state of player and playlist, to the server via a save callback

Info could be stored in session or in a DB table connected with User on BE side.

The host app needs to setup client tokens ? https://github.com/waiting-for-dev/devise-jwt


    it calls:
        a) interval is configurable via datashift_audio.save_interval = 1000; // in milliseconds
        b) player finished to play current track
        c) on pause() click
        d) on previous() click
        e) on next() click
        f) on seek() of track

    
# BackEnd part
    
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
    
                cover_image: 'http://link.to/images/1.jpeg',
                audio_url: 'http://link.to/audio/1.mp3',
    
                duration: 100,
            },
        ]
    }
```
    
for radio
===
request: url: ``` 'radio_data' ```
    
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
    
            cover_image: 'http://link.to/images/1.jpeg',
            audio_url: 'http://link.to/audio/1.mp3',
                
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

#Q/A


#### @Sloboda  What is the HTML for adding the single thin banner player to any particular view - can you  document what CSS can be used to change look and feel of the player ?
#### Answer - For including player to any page just use helper
              For updating of styles -> check wich file of styles u need to include and type it in application.css and
              modify all data u need in separate file imported after datashift_audio_engine/application.css

#### @Sloboda  - Is the main target for the player a div ALWAYS with id="datashift-audio-player"  regardless of Player Type
#### Answer - Yes

#### @Sloboda  - Is this the way to load track data regardless of whether player is full width, hover button, thin main  player ?
#### Answer - Yes

#### @Sloboda - What is this url and is this really the save callback json ? ('user/set_state')
#### Answer - Yes, its save call back with ability to get/set state

#### @Sloboda - How to pass such configuration from the Ruby world to the Javascript world ?
#### Answer - erb, json, ajax

#### @Sloboda How to style the player - What are the key CSS classes to change look and feel of the player ?
#### Answer - 

```
.datashift-audio-player
    datashift-audio-track-cover
    .datashift-audio-track-basic-info
        .datashift-audio-track-name
        .datashift-audio-author-name
    .datashift-audio-wave-block
    ol.datashift-audio-playlist
    ol.datashift-audio-pages
```


## Contributing
Contribution directions go here.

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
