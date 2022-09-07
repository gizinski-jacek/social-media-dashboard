import { Box, Button, Card, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { InstagramPost } from '../../../types/myTypes';

interface Props {
	data: InstagramPost;
}

const InstagramPostWrapper = ({ data }: Props) => {
	const [contentIsTall, setContentIsTall] = useState(false);
	const [showMoreContent, setShowMoreContent] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const handleToggleShow = () => {
		setShowMoreContent((prevState) => !prevState);
		setShowComments(false);
	};

	const handleToggleComments = () => {
		setShowComments((prevState) => !prevState);
	};

	useEffect(() => {
		setContentIsTall(ref.current?.clientHeight > 200);
	}, []);

	return (
		<Card
			sx={{
				maxHeight: contentIsTall ? (showMoreContent ? 'auto' : 200) : 200,
				minWidth: 300,
				m: 1,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				position: 'relative',
				border: '1px solid red',
				a: {
					color: 'teal',
				},
			}}
			id={data.id}
		>
			<Box m={1}>
				<Link href={`https://www.instagram.com/${data.username}`}>
					{data.username}
				</Link>
				<h6>
					{new Date(data.timestamp).toLocaleDateString(undefined, {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
						hour: 'numeric',
						minute: 'numeric',
					})}
				</h6>
			</Box>
			<Box>
				<p>{data.caption}</p>
			</Box>
			<Box ref={ref} m={1}>
				<Box>
					<Image
						src={data.media_url}
						width={280}
						height={280}
						alt={data.caption || `Attachment ${data.media_type}`}
					/>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button
						type='button'
						variant={showComments ? 'contained' : 'outlined'}
						onClick={handleToggleComments}
					>
						Comments
					</Button>
					<Button variant='outlined' component='a' href={data.permalink}>
						Go To Post
					</Button>
				</Box>
			</Box>
			{contentIsTall ? (
				<Button
					type='button'
					onClick={handleToggleShow}
					variant='contained'
					sx={{
						opacity: 0.5,
						position: showMoreContent ? 'static' : 'absolute',
						bottom: 0,
						width: '100%',
						zIndex: 5,
						textAlign: 'center',
					}}
				>
					{showMoreContent ? 'Show Less' : 'Show More'}
				</Button>
			) : null}
		</Card>
	);
};

export default InstagramPostWrapper;
