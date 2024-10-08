
import express, {Response, Request, NextFunction} from "express";




const app = express();

app.use(express.json());


app.get('/', (req: Request, res :Response) => {

    res.send("THIS API IS WORKING AS EXPECTED")

})

app.use((req: Request, res : Response, next: NextFunction) => {

    console.log("hello from this middleware");
    next();

})


app.all("*", (req: Request, res : Response, next: NextFunction) => {

    throw new Error("This route does not exist");
    

})

export default app;