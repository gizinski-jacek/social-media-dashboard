import { Button, Card } from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FacebookPost } from '../../../types/myTypes';

interface Props {
	data: FacebookPost;
}

const FacebookPostWrapper = ({ data }: Props) => {
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
				width: 300,
				m: 1,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				position: 'relative',
				border: '1px solid blue',
				a: {
					color: 'teal',
				},
			}}
			id={data.id}
		>
			<Box
				sx={{
					m: 1,
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Box>
					<Link
						href={`https://www.facebook.com/profile.php?id=${data.from.id}`}
					>
						{data.from.name}
					</Link>
					<h6>
						{'Posted: '}
						{new Date(data.created_time).toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
						})}
					</h6>
				</Box>
				<Box
					ref={ref}
					sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
				>
					<Box
						sx={{
							flex: 1,
							maxWidth: '100%',
							overflowWrap: 'break-word',
							mb: 'auto',
						}}
					>
						<p>{data.message}</p>
					</Box>
					{data.attachments ? (
						<Box>
							{data.attachments?.data.map((d) => (
								<Box key={d.target.id}>
									{/* Hacky solution for dynamic domains issue with Image component */}
									{/* Replacing part of uri to specific allowed domain in config */}
									<Box>
										{d.subattachments?.data.map((s, index) => (
											<Link key={s.target.id} href={s.target.url}>
												<Image
													src={d.media.image.src.replace(
														/.+?(?=.fbcdn.net)/,
														'https://scontent.fpoz4-1.fna'
													)}
													width={s.media.image.width}
													height={s.media.image.height}
													alt={s.description || `Attachment ${s.type}`}
													placeholder='blur'
													blurDataURL={d.media.image.src.replace(
														/.+?(?=.fbcdn.net)/,
														'https://scontent.fpoz4-1.fna'
													)}
												/>
											</Link>
										))}
										{d.subattachments ? null : (
											<Link href={d.target.url}>
												<Image
													src={d.media.image.src.replace(
														/.+?(?=.fbcdn.net)/,
														'https://scontent.fpoz4-1.fna'
													)}
													width={d.media.image.width}
													height={d.media.image.height}
													alt={d.description || `Attachment ${d.type}`}
												/>
											</Link>
										)}
									</Box>
								</Box>
							))}
						</Box>
					) : null}
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Button
							type='button'
							variant={showComments ? 'contained' : 'outlined'}
							onClick={handleToggleComments}
						>
							Comments
						</Button>
						<Button variant='outlined' component='a' href={data.permalink_url}>
							Go To Post
						</Button>
					</Box>
				</Box>
			</Box>
			{showComments ? (
				<Box>
					{data.comments?.data.map((c) => (
						<Card key={c.id} id={c.id} sx={{ m: 1, p: 1 }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<Link
									href={`https://www.facebook.com/profile.php?id=${c.from.id}`}
								>
									{c.from.name}
								</Link>
								<h6>
									{new Date(c.created_time).toLocaleDateString(undefined, {
										year: 'numeric',
										month: 'numeric',
										day: 'numeric',
										hour: 'numeric',
										minute: 'numeric',
									})}
								</h6>
							</Box>
							<Box>
								<p>{c.message}</p>
							</Box>
						</Card>
					))}
				</Box>
			) : null}
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

export default FacebookPostWrapper;
