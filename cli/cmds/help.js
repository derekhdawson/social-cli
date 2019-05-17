const menus = {
    main: `
        social [command] <options>


        register .............. creates a new social account for you


        login ................. logs you in to social


        logout................. logs you out of social


        send-request........... send a friend request

            examples:
            social send-request --id="5cd9c466a612adac28e0023d"
            social send-request --username="derekd"


        accept-request........... accept a friend request

            examples:
            social accept-request --id="5cd9c466a612adac28e0023d"
            social accept-request --username="derekd"


        help .................. show help menu for a command
        
        `,

    register: `
        social register`,

    login: `
        social login <options>

        --email=[your email]
        --password=[your password]`,
    
    'send-request': `
        social send-request <options>

        --id=[id]
        --username=[username]

    `,

    'accept-request': `
    social accept-request <options>

    --id=[id]
    --username=[username]

    `

    
}

module.exports = (args) => {
    const subCmd = args._[0] === 'help'
        ? args._[1]
        : args._[0]
    console.log(menus[subCmd] || menus.main)
}

