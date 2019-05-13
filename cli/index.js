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
        case 'profile':
            require('./cmds/profile')(args)
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