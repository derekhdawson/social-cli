const minimist = require('minimist')

module.exports = () => {
    const args = minimist(process.argv.slice(2))

    let cmd = args._[0] || 'help'

    if (args.version || args.v) {
        cmd = 'version'
    }

    if (args.help || args.h) {
        cmd = 'help'
    }

    switch (cmd) {
        case 'register':
            require('./cmds/register')(args)
            break
        case 'login':
            require('./cmds/login')(args)
            break
        case 'logout':
            require('./cmds/logout')(args)
            break
        case 'profile':
            require('./cmds/profile')(args)
            break
        case 'send-request':
            require('./cmds/sendRequest')(args)
            break
        case 'accept-request':
            require('./cmds/acceptRequest')(args)
            break
        case 'search-users':
            require('./cmds/searchUsers')(args)
            break
        case 'create-post':
            require('./cmds/createPost')(args)
            break
        case 'posts':
            require('./cmds/posts')(args)
            break
        case 'friends':
            require('./cmds/friends')(args)
            break
        case 'comment':
            require('./cmds/comment')(args)
            break
        case 'version':
            require('./cmds/version')(args)
            break
        case 'help':
            require('./cmds/help')(args)
            break

        default:
            console.error(`"${cmd}" is not a valid command!`)
            break
    }
}