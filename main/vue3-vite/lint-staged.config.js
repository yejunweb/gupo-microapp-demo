module.exports = {
    '*': ['ls-lint'], // 检查文件名称是否规范
    '*.{js,jsx,ts,tsx}': [
        // eslint, prettier 修复
        'prettier --write',
        'eslint --fix',
    ],
    '{!(package)*.json,*.code-snippets,.!(browserslist|nvm|sentry|yarn|npm)*rc}': ['prettier --write --parser json'], // prettier 一些额外格式的文件
    'package.json': ['prettier --write'], // prettier package.json
    '*.vue': [
        // 修复 vue 文件
        'prettier --write',
        'stylelint --fix',
        'eslint --fix',
    ],
    '*.{css,scss,sass,less,styl,html}': [
        // 修复样式文件
        'prettier --write',
        'stylelint --fix',
    ],
    '*.md': ['prettier --write --parser markdown --prose-wrap never'],
};
