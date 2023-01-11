const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {


    const validateUser = async (req, res) => {
        await prisma.prismausers.findUnique({where: {userName_password: {userName: req.body.username, password: req.body.password}}})
            .then(data => {
                if (data === null){
                    res.status(401).send(
                        false
                    )
                }
                else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving users."
                });
            });
    }

    const authorizeUser = async (req, res) => {
        await prisma.prismatodos.findMany({ where: {userID: req.body.id} })
            .then(data => {
                res.send(data)
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving users."
                });
            });
    }


    const getTodos = async (req, res) => {
        await prisma.prismatodos.findMany()
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving todos."
                });
            });
    }

    const createTodo = async (req, res) => {

        await prisma.prismatodos.create({data: {title: req.body.title, completed: req.body.completed, userID: req.body.userID}})
            .then(()=> {
                res.sendStatus(201);
            })
            .catch( () => {
                res.sendStatus(500);
            });
    };

    const updateTodo = async (req, res) => {

        await prisma.prismatodos.update(
            {where: { id: parseInt(req.params.id), }, data: {title: req.body.title, completed: req.body.completed}},
        )
            .then(()=> {
                res.sendStatus(201);
            })
            .catch( () => {
                res.sendStatus(500);
            });
    };

    const deleteTodo = async (req, res) => {

        await prisma.prismatodos.delete({
            where: { id: parseInt(req.params.id)},
        })
            .then(()=> {
                res.sendStatus(202);
            })
            .catch(() => {
                res.sendStatus(500);
            });
    };

    const getLogs = (req, res) => {
        res.send(logs);
    };

    module.exports = {
        getTodos,
        createTodo,
        updateTodo,
        deleteTodo,
        validateUser,
        authorizeUser,
        getLogs
    }

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
