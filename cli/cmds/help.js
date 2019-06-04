const menus = {
    main: `
        social [command] <options>


        register .............. creates a new social account for you


        login ................. logs you in to social


        logout................. logs you out of social

        posts ................. see all posts, filter by hashtags

            examples:
            social posts --hashtags="basketball,nba finals"
            social posts --global
            social posts --tagged-in

        create-post................... make a post

            examples:
            social create-post --post="Just saw Endgame, it was incredible" --tag="derek,andrew"  --hashtags="endgame,mustsee" --global

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
            social accept-request --username="derek"

        friends.................. see list of your friends


        friend-requests.......... see list of incoming friend requests
        

        search-users.............. search for users on the network

            examples:
            social search-users --username="derek"


        help .................. show help menu for a command
        `,

    register: `
        social register`,

    login: `
        social login <options>

        --email=[your email]
        --password=[your password]`,

    logout: `
        social logout
    `,
    
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
    'create-post': `
        social create-post <options>

        --post=[post]
        --tag=<username1, username2, username3...>
        --hashtags=<hashtag1, hashtag2, hashtag3...>
        --is-public=[isPublic]
    `,
    comment: `
        social comment <options>
        
        --comment=[comment]
        --postId=[id]
    `,
    friends: `
        social friends
    `,
    posts: `
        social posts <options>

        --hashtags=<hashtag1, hashtag2, hashtag3...>
        --global
        --tagged-in
    `

    
}

module.exports = (args) => {
    const subCmd = args._[0] === 'help'
        ? args._[1]
        : args._[0]
    console.log(menus[subCmd] || menus.main)
}

