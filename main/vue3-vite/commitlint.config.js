module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'header-max-length': [2, 'always', 200],
        'type-enum': [2, 'always', ['WIP', 'feat', 'fix', 'refactor', 'docs', 'test', 'style', 'perf', 'ci', 'revert', 'chore']],
        'scope-empty': [1, 'never'],
        'subject-case': [0, 'always'],
        'scope-case': [0],
    },
};
