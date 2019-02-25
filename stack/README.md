# PlayDBET Stack

This is a self-contained Thor Instance that already has the contracts migrated. Useful for frontend development.

## TL;DR

Execute `docker-compose up`. Hardcode the Contracts' Addresses shown below.

## Contract Addresses

```
Admin: 0xBa51DCEAE13514284fBdB8b3d541E225E9a69666
Quest: 0x04C466da691Cf7B6c1A0352757f405436ba6c08c
Token: 0x2B61c861c38fBAac067e6a447881C4e5D9AdbeeC
```

## How was this made?

-   Compile the contracts. `truffle compile`
-   Run a Docker Container with `/root/.org.vechain.thor` mapped to a local volume. I do it via a temporary `docker-compose.yml` similar to:

```yml
version: '3'
services:
    thor:
        image: vechain/thor:v1.0.6
        container_name: thor-playdbet-migration
        ports:
            - '127.0.0.1:8669:8669'
            - '11235:11235'
            - '11235:11235/udp'
        command: solo --persist --api-addr 0.0.0.0:8669 --api-cors "*"
        network_mode: host
        volumes:
            - ./data:/root/.org.vechain.thor
```

-   Migrate the contacts to the Thor Instance. `npm run migrate -- --network=solo`
-   Stop the docker image.

Now you have a Thor Database with the migrated contracts. This database can be imported to a custom Docker Image so that the Thor Instance starts with the contracts already deployed. That is done by writing a `Dockerfile` that copies the Thor Database into the image. See `./thor/Dockerfile` for details.
