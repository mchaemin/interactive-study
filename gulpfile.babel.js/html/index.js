const {src, dest} = require('gulp');
const fs = require('fs-extra');
const cheerio = require('cheerio');
const newer = require('gulp-newer');
const htmlhint = require('gulp-htmlhint');
const ejs = require('gulp-ejs');
const beautify = require('gulp-jsbeautifier');
const config = require('../../config.json');

function setHTML () { 
  return src([config.htmlSetting.src, '!' + config.htmlSetting.except])
    .pipe(newer(config.htmlSetting.dist))
    .pipe(ejs())
    .pipe(htmlhint('templates/htmlhint.json'))
    .pipe(htmlhint.reporter())
    .pipe(beautify({
        config: '.jsbeautifyrc',
        mode: 'VERIFY_AND_WRITE'
    }))
    .pipe(dest(config.dir.dist))
}

const generateHTML = async (done) => {
  const dirPath = 'dist/views/';
  const files = await fs.promises.readdir(dirPath);
  const htmlFiles = files.filter(file => file.endsWith('.html'));

  // 파일번호 정렬 함수
  const numberRegex = /\d+/g;
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const extractNumbers = (filename) =>
    (filename.match(numberRegex) || []).map(n => parseInt(n, 10));

  htmlFiles.sort((a, b) => {
    const numsA = extractNumbers(a);
    const numsB = extractNumbers(b);
    if (numsA.length && numsB.length) {
      const len = Math.max(numsA.length, numsB.length);
      for (let i = 0; i < len; i++) {
        const va = numsA[i];
        const vb = numsB[i];
        if (va === undefined && vb === undefined) continue;
        if (va === undefined) return -1;
        if (vb === undefined) return 1;
        if (va !== vb) return va - vb;
      }
      return collator.compare(a, b);
    }
    if (numsA.length && !numsB.length) return -1;
    if (!numsA.length && numsB.length) return 1;
    return collator.compare(a, b);
  });

  let fileObjArr = [];
  let categories = [];
  let projectJson = JSON.parse(await fs.promises.readFile('templates/projectInfo.json', 'utf-8'));
  let projectInfo = {
    projectName: projectJson.project_name,
    projectAuthor: projectJson.author,
    projectOrg: projectJson.organization,
  };

  for (const file of htmlFiles) {
    const filePath = `${dirPath}${file}`;
    const stats = await fs.promises.stat(filePath);
    const fileInnerText = await fs.promises.readFile(filePath, 'utf8');
    const $ = cheerio.load(fileInnerText);
    let wholeTitle = $('meta[name="list"]').attr('content') || $('title').text();
    let splitTitle = wholeTitle.split(' : ');
    let pageStatus = $('body').data('pagestatus');
    let splitStatus = pageStatus ? pageStatus.split(' : ') : null;

    let fileData = {
      title: splitTitle[0],
      name: file,
      category: file.substring(0, 2),
      categoryText: splitTitle[1],
      listTitle: wholeTitle,
      mdate: stats.mtime,
    };
    if (splitStatus) {
      fileData.splitStatus = splitStatus[0];
      fileData.splitStatusDate = splitStatus[1];
    }

    fileObjArr.push(fileData);
    if (!categories.includes(fileData.category)) categories.push(fileData.category);

    if ($('meta[name="list"]').length) {
      $('meta[name="list"]').remove();
      await fs.promises.writeFile(filePath, $.html({ decodeEntities: false }));
    }
  }

  let projectObj = {
    project: projectInfo,
    files: fileObjArr,
  };

  return src('templates/@index.html')
    .pipe(ejs(projectObj))
    .pipe(dest('dist/'))
    .on('end', done);
};

module.exports = {
  setHTML,
  generateHTML,
};