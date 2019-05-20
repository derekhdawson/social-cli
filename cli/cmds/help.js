const menus = {
    main: `
        social [command] <options>


        register .............. creates a new social account for you


        login ................. logs you in to social


        logout................. logs you out of social


        post................... make a post

            examples:
            social post --post="Just saw Endgame, it was incredible" --tag="derek,andrew"  --hashtags="endgame,mustsee"

        comment................. comment on a post
            examples:
            social comment --comment="nice photo!" postId="5ce30cddf9534a3486266621"

        send-request........... send a friend request

            examples:
            social send-request --id="5cd9c466a612adac28e0023d"
            social send-request --username="derekd"


        accept-request........... accept a friend request

            examples:
            social accept-request --id="5cd9c466a612adac28e0023d"
            social accept-request --username="derekd"

        search-users.............. search for users on the network


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
    `,
    'search-users': `
        social search-users <options>

        --username=[username]
    `,
    post: `
        social post <options>

        --post=[post]
        --tag=<username1, username2, username3...>
        --hashtags=<hashtag1, hashtag2, hashtag3...>
    `,
    comment: `
        social comment <options>
        
        --comment=[comment]
        --postId=[id]
    `

    
}

module.exports = (args) => {
    const subCmd = args._[0] === 'help'
        ? args._[1]
        : args._[0]
    console.log(menus[subCmd] || menus.main)
}

