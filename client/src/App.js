import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import './App.css';

import Home from './pages/Home';
import Title from './layout/Title';
import ShowPage from './pages/ShowPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/people/:personId',
		element: <ShowPage />,
	},
]);

const client = new ApolloClient({
	uri: 'http://localhost:4000/graphql',
	cache: new InMemoryCache(),
});

const App = () => {
	return (
		<ApolloProvider client={client}>
			<div className='App'>
				<Title />
				<RouterProvider router={router} />
			</div>
		</ApolloProvider>
	);
};

export default App;
