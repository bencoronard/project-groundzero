import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// app.get('/users/:id', async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.id;
//     const user = await getUserByIdUseCase.execute(userId);
//     if (user) {
//       res.status(200).json(user);
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

console.log('End of the script!');
