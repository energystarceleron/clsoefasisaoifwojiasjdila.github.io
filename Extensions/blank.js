
(function () {

  /* THEME */

 

  /* THEME + GRID */

  class HitCirclesGridTheme extends HitCirclesTheme {

    _getCustomFiles () {

      return $.extend ( super._getCustomFiles (), {
        'map_forest.jpg': 'map_forest_grid.jpg',
        'map_rock_mask.jpg': 'map_rock_mask_grid.jpg',
        'map_sand_mask.jpg': 'map_sand_mask_grid.jpg',
        'map_sea.jpg': 'map_sea_grid.jpg',
        'map_sea_mask.jpg': 'map_sea_mask_grid.png'
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
