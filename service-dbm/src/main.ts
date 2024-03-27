import express, { Request, Response } from 'express';

const PORT: number = 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
