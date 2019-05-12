const menus = {
    main: `
        social [command] <options>

        register .............. creates a new social account for you
        login ............ logs you in to social
        help ............... show help menu for a command`,

    register: `
        social register <options>`,

    login: `
        social login <options>

        --username=[your username]
        --password=[your password]`
}

module.exports = (args) => {
    const subCmd = args._[0] === 'help'
        ? args._[1]
        : args._[0]
    console.log(menus[subCmd] || menus.main)
}

