const fs = require('fs-extra');
const path = require('path');
const {src, dest} = require('gulp');
const imagemin = require('gulp-imagemin');
const tap = require('gulp-tap');
const webpack = require('webpack');
const cache = require('gulp-cached')
const webpackStream = require('webpack-stream');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const svgmin = require('gulp-svgmin');
const spritesmith = require('gulp.spritesmith-multi');
const svgSprite = require('gulp-svg-sprite');
const vinylBuffer = require('vinyl-buffer');
const sort = require('gulp-sort');
const merge = require('merge-stream');
const del = require('del');
const sassInlineSvg = require('gulp-sass-inline-svg');
const config = require('../../config.json');
require('babel-polyfill');

const generateImages = () =>{
  return src(config.imgSetting.src)
  .pipe(cache('generateImages'))
  .pipe(tap(file => {
    console.log(`📦 generateImage 처리 중: ${file.relative}`);
  }))
  .pipe(webpackStream({
    context:path.resolve(process.cwd(), 'src/img'),
    mode: 'production',
    output: {
      filename: '[name][ext]',
      assetModuleFilename: '[path][name][ext]'
    },
    module:{
      rules:[
        {
          test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
          type: 'asset/resource', // webpack5 의 file-loader 표준 방식
        }
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: [
                ['gifsicle', { interlaced: true }],
                ['mozjpeg', { quality: 80 }],
                ['optipng', { optimizationLevel: 5 }],
                ['svgo', {
                  plugins: [
                    { name: 'removeViewBox', active: true },
                    { name: 'removeDimensions', active: false },
                  ],
                }],
              ],
            },
          },
        }),
      ],
    }
  }, webpack))
  .pipe(dest(config.imgSetting.dist));
}
const generateSprite = () => {
    var opts = {
        spritesmith: function(options, sprite, icons) {
            options.imgPath            = `../img/${options.imgName}`;
            options.cssName            = `_${sprite}.scss`;
            options.cssTemplate        = `./src/css/sprites-data/spritesmith-mixins.handlebars`
            options.cssSpritesheetName = sprite;
            options.padding            = 4;
            options.algorithm          = 'binary-tree';
            return options;
        }
    };
  var spriteData = src('./src/img/sprites/**/*.png')
  .pipe(cache('spritePNG')) // PNG 스프라이트 캐시
  .pipe(tap(file => {
    console.log(`📦 generateSprite 처리 중: ${file.relative}`);
  }))
  .pipe(spritesmith(opts)).on('error', function(err) {
      console.log(err);
  });

  var imgStream = spriteData.img
    .pipe(vinylBuffer())
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 5}),
    ], {
      verbose: true
    }))
    .pipe(dest('./dist/img/'));
    var cssStream = spriteData.css
    .pipe(tap(file => {
      console.log(`📦 generateSprite CSS 처리 중: ${file.relative}`);
    }))
    .pipe(dest('./src/css/sprites-data'));
  return merge(imgStream, cssStream);
}

const getFolders = (dir) => {
  let result = [];
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  } else if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    result = fs.readdirSync(dir).filter((file) => fs.statSync(path.join(dir, file)).isDirectory());
  }
  return result;
}

const spriteSvg = async () => {
  const folders = getFolders(`${config.dir.src}/img/sprites-svg`);
  let options = {
    spritesmith: (options) => {
      const {folder, config} = options;
      return {
        shape: {
          spacing: {
            padding: 4
          },
          id: {
            generator: function (name) {
              return path.basename(name.split(`${config.dir.src}/css/sprites-data`).join(""), '.svg');
            }
          }
        },
        mode: {
          css: {
            dest: './',
            bust: false,
            sprite: folder + '-svg.svg',
            render: {
              scss: {
                template: path.join(`${config.dir.src}/css/sprites-data`, 'sprite-svg-mixins.handlebars'),
                dest: path.posix.join(`${config.dir.src}/css`, 'sprites-data', '_' + folder + '-svg-mixins.scss')
              }
            }
          }
        },
        variables: {
          spriteName: folder,
          baseName: path.posix.relative(`${config.dir.src}/css`, path.posix.join(`${config.dir.src}/img`, folder + '-svg')),
          svgToPng: ''
        }
      }
    },
  };

  await Promise.all(
    folders.map((folder) => {
      return new Promise((resolve => {
        src(path.join(`${config.dir.src}/img/sprites-svg`, folder, '*.svg'))
          .pipe(cache('spriteSVG')) // SVG 변경 여부에 따라 캐싱        
          .pipe(tap(file => {
            console.log(`📦 generateSprite 처리 중: ${file.relative}`);
          }))
          .pipe(sort())
          .pipe(svgSprite(options.spritesmith({folder, config})))
          .pipe(imagemin([
            imagemin.svgo({ // svg
              plugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
              ]
            })
          ], {
            verbose: true
          }))
          .pipe(dest('./'))
          .on('end', resolve);
      }))
    })
  );
}

const spriteSvgMove = () =>
    src("./*.svg")
    .pipe(tap(file => {
      console.log(`📦 spriteSvgMove 처리 중: ${file.relative}`);
    }))
    .pipe(dest(`${config.dir.dist}/img`))

const delSvg = (done) => {
    del("./*.svg")
    done()
}
const generateSVG = () =>src(config.imgSetting.svg)
.pipe(cache('generateSVG'))
.pipe(tap(file => {
  console.log(`📦 generateSVG 처리 중: ${file.relative}`);
}))
.pipe(svgmin({
  plugins:[
    {removeViewBox:true},
    {cleanupIDs:false}
  ]
}))
.pipe(sassInlineSvg({
    destDir: "src/css/scss/inline-svg"
  })
);
module.exports={
  generateImages,
  generateSprite,
  generateSVG,
  spriteSvg,
  spriteSvgMove,
  delSvg
}