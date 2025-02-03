
(function () {

  /* THEME */

  class HitCirclesTheme extends VanillaTheme {

    constructor () {

      super ();

      SWAM.on ( 'mobAdded', ( ...args ) => setTimeout ( () => this._onMobAdded ( ...args ) ) ); //FIXME: Super ugly, but the tint gets overridden otherwise

      setTimeout ( this.setLayers.bind ( this ) );

    }

    setLayers () {

      game.graphics.layers.shadows.visible = false;
      game.graphics.layers.smoke.visible = false;

    }

    _getPlayerTint ( player ) {

      return this.settings.gameplay.colorPlayers
               ? player
                 ? player.team === 1
                   ? 6148089
                   : player.team === 2
                     ? 16342394
                     : 16777215
                 : 16378973
               : 16777215

    }

    _getThrusterTint ( player ) {

      return this.settings.gameplay.colorPlayers
               ? player
                 ? player.team === 1
                   ? 11003130
                   : player.team === 2
                     ? 16426935
                     : 16777215
                 : 16446375
               : 16777215

    }

    _getMobScale ( mob ) {

      return mob.type === 2
               ? [.2, .2]
               : mob.type === 3
                 ? [.2, .2]
                 : [.2, .15];

    }

    _onMobAdded ( data, existing, playerId ) {

      if ( game.gameType !== 2 ) return;

      if ( !this.settings.gameplay.colorMissiles ) return;

      let mob = Mobs.get ( data.id );

      if ( !mob ) return;

      if ( ![ 1, 2, 3, 5, 6, 7 ].includes ( mob.type ) ) return;

      let player = Players.get ( playerId );

      /* TINTING */

      mob.sprites.thruster.tint = this._getThrusterTint ( player );
      mob.sprites.sprite.tint = this._getPlayerTint ( player );

      /* SCALING */

      mob.sprites.sprite.scale.set ( ...this._getMobScale ( mob ) );

    }

    tintPlayer ( player ) {

      player.sprites.sprite.tint = this._getPlayerTint ( player );

    }

    _getFileName ( str ) {

      str = str.substring ( str.lastIndexOf ( '/' ) + 1 );

      if ( str.indexOf ( '?' ) > - 1 ) {
        str = str.substr ( 0, str.indexOf ( '?' ) );
      }

      return str;

    }

    _getCustomFiles () {

      return {
        
        'shadows.png': 'shadows.png'
      };

    }

    injectTextures ( files, textureInfo, flagTextureInfo, spriteInfo, textures ) {

      const customFiles = this._getCustomFiles ();

      for ( let key in files ) {

        const fileName = this._getFileName ( files[key] );

        if ( fileName in customFiles ) {

          // files[key] = `http://localhost:4444/themes/hit_circles/assets/${customFiles[fileName]}`; // Development
          files[key] = `https://raw.githubusercontent.com/fabiospampinato/airmash-swam-extensions/master/themes/hit_circles/assets/${customFiles[fileName]}`; // Production

        }

      }

    }

  }

  $.extend ( HitCirclesTheme, {
    themeName: '-UNSWAM-PING',
    description: 'A theme that -UNSWAM-PING.',
    author: 'gulf'
  });

  /* THEME + GRID */

  class HitCirclesGridTheme extends HitCirclesTheme {

    _getCustomFiles () {

      return $.extend ( super._getCustomFiles (), {
        
        'map_rock_mask.jpg': 'map_rock_mask_grid.jpg',
        
        
      });

    }

  }

  $.extend ( HitCirclesGridTheme, {
    themeName: '-UNSWAM-PINGGG',
    description: 'A theme that -UNSWAM-PINGGG.',
    author: 'gulf'
  });

  /* REGISTER */

  SWAM.registerExtension ({
    name: '-UNSWAM-PING',
    id: 'fabiospampinato.hitCircles',
    description: 'A theme that -UNSWAM-PING.',
    version: '1.0.0',
    author: 'gulf',
    themes: [HitCirclesTheme, HitCirclesGridTheme]
  });

}());
