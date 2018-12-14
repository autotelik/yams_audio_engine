# Datashift Audio Engine

Audio player for Rails apps.

Add an audio player partial to any page. 

Configure playlist via JSON.

Receive player data vis callbacks.

## Installation

Add to Gemfile:

```ruby
gem 'datashift_audio_engine'
```

And then execute:
```bash
$ bundle install
```

Add the JS to your application javascript file

```javascript
//= require datashift_audio_engine/application
```

Some basic styles are provided in SASS, import the application style file

```scss
/*
@import "datashift_audio_engine/datashift_audio_engine";
 */
```

Or you can bring in only the individual items required

```scss
/*
@import "cover";
@import "icons";
@import "player";
@import "playlist";
@import "volume";
 */
```

### Setup 

Summary - To add an audio player

- Configure - includes the URLs required to initialise the player and load a playlist, or track to play.

- Add player and script partials to Views

- Create helper to convert your DB representation, or track listings into JSON format expected by the player.


#### Configuration 

The following variables can be used in the Javascript to configure the player.

```
is_radio        - true .. false
save_interval   - in milliseconds

routes.
    init_url    - url of action wich will authorize user and will load personalized 
                  information about player right for current user
                  
    load_url    - url of action wich will form playlist load action with params
    save_url    - url of action which will manage save status callback
    radio_url   - url of action which will manage loading a radio stream
    
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

These can be set directly in Rails views, for example 

```erb
<script type="text/javascript" charset="utf-8">
    $(document).ready(function(){
        datashift_audio_engine.settings.autoplay = true;
        datashift_audio_engine.save_interval = 5000;
    });
</script>
```

To generate a Ruby configuration block, within the host Rails app's initializers, you can run the following rails generator

```bash
bundle exec rails generate datashift_audio_engine:install
```

Each of the settable javascript settings, has an analogous setting in the Rails configuration block,
which can be used to set defaults or global values.

At some point in the flow, the Ruby value has to be assigned to the javascript audio player, for example

```erb
<script type="text/javascript" charset="utf-8">
  $(document).ready(function(){
        datashift_audio_engine.settings.autoplay = DatashiftAudioEngine::Configuration.call.autoplay;
        datashift_audio_engine.save_interval = DatashiftAudioEngine::Configuration.call.save_interval;
  });
</script>
```

#### Views 

To add the player to any view :

- Render the `datashift_audio_player_tag` helper, to generate the player HTML markup.

- Render the `datashift_audio_player_script` helper, to init the javascript and load JSON defining the audio to play.
  
Partial
  
```erb
<%= datashift_audio_player_tag %>

<%= datashift_audio_player_script( load_url: "#{radio_index_url}.json" )  %>
```

The helper takes optional urls, which will over ride the init, load and save status urls specified in config. 

> N.B init and load urls format should be JSON

For example, you can specify Rails named routes, with json format :

```erb
    <%= datashift_audio_player_script(init_url: "#{player_init_url}.json", load_url: "#{track_url(@track)}.json", save_url: player_status_callback_url) %>
```

To access these engine helpers, you'll probably need to pull the engine's helper module into a relevant controller or ApplicationController

Add following to your Controller

```ruby
  helper DatashiftAudioEngine::ApplicationHelper
```

For reference, the `datashift_audio_player_script` generates these 2 low level Javascript calls, to init and load the player. 

Both take an optional url.

```javascript
<script type="text/javascript" charset="utf-8">
    $(document).ready(function(){
        datashift_audio_engine.init();
        datashift_audio_engine.load();
    });
</script">
```

The helper also takes these optional urls, which will over ride the init and load urls specified in config. 

For example, you can specify Rails named routes

> N.B init and load urls format should be JSON

```erb
    <%= datashift_audio_player_script(init_url: "#{player_init_url}.json", load_url: "#{track_url(@track)}.json", save_url: player_status_callback_url) %>
```


#### Javascript methods and call-backs

Each callback should be related to a route in the main Rails app side, connected to a suitable
controller method that can parse or store the supplied  data.

##### How to init?

init -  it sends request during datashift_audio_engine.init() function call once 
        when we need to sync basic player settings possible 
        url structure 'user/get_state'
        it sends local variables of {user_token} and {client_token}
        and should obtain JSON with sync data of player
        The structure of answer is:

Example route for the init callback - use the create action on an InitPlayerController

```ruby
  post 'init_player', to: 'init_player#create'
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

##### How to load?

The load callback sends back track listing and audio uurl information.
       call once when we need to load playlist and set it into basic state on first open
       possible url structure 'playlist/:id.page' or 'audio/:id'
       request: { user_token, client_token, random }
       expected strucuture of answer:

    
```json
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
        }, etc
        ],
    }
```

You can also provide your own your own track listing HTML in property - `playlist_partial` - which will over ride the auto generated listing

For example, in the view rendering your playlist json also render a track listing partial and assign to json property `playlist_partial`

```
# app/views/radio/index.json.jbuilder

json.playlist_partial json.partial! 'my_audio_app/playlist.html.erb', locals: { tracks: @tracks }
``````


##### How to get current state - save callback ?

Structure of user state

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
            }, ETC
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

#### Views - HTML Markup and CSS

##### How to pin to top/bottom?

CSS classes are available to place the player at the `top` or `bottom` of the page.

Default value is TOP

```
<%= datashift_audio_player_tag(pin_to: :top) %>
```

or 

```
<%= datashift_audio_player_tag(pin_to: :bottom) %>
```

 
###### Key Classes

To show elements :

```js
    $('#item').removeClass('datashift-audio-hide');
 ```  
     
To hide :

```js      
    $('#item').addClass('datashift-audio-hide');
```
                      
Track Controls :

- #datashift-audio-player .play
- #datashift-audio-player .pause

- #datashift-audio-player .datashift-audio-track-controls .previous
- #datashift-audio-player .datashift-audio-track-controls .next
    
    
Cover image : `datashift-audio-track-cover` 
    
#### ORIGINAL README


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
