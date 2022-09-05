import { Card, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import { FacebookPost } from '../../../types/myTypes';

interface Props {
	data: FacebookPost;
}

const FacebookPostWrapper = ({ data }: Props) => {
	return (
		<Card
			sx={{
				flex: 1,
				m: 2,
				mb: 0,
				minHeight: 80,
				height: 'fit-content',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
			id={data.id}
		>
			<Typography variant='caption' m={1}>
				{'Posted: '}
				{new Date(data.created_time).toLocaleDateString(undefined, {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
				})}
			</Typography>
			<Typography variant='h5' m={1}>
				{data.message}
			</Typography>
			{data.attachments?.data.map((d) => (
				<Box key={d.target.id}>
					{/* {Removing images rendering until I find a way to accept images from dynamic FB domains} */}
					{/* <Box>
						{d.subattachments?.data.map((s, index) => (
							<Image
								key={s.target.id}
								src={d.media.image.src}
								width={s.media.image.width}
								height={s.media.image.height}
								alt={`Attachment number ${index}`}
							/>
						))}
						{d.subattachments ? null : (
							<Image
								src={d.media.image.src}
								width={d.media.image.width}
								height={d.media.image.height}
								alt={d.title}
							/>
						)}
					</Box> */}
					<Typography variant='h6'>{d.description}</Typography>
				</Box>
			))}
			{data.comments?.data.map((c) => (
				<Card key={c.id} id={c.id}>
					Comment:
					<Typography variant='caption' m={1}>
						{'Posted: '}
						{new Date(c.created_time).toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
						})}
						<Typography variant='h5' m={1}>
							{c.message}
						</Typography>
						<Typography variant='h6' m={1} id={c.from.id}>
							{c.from.name}
						</Typography>
					</Typography>
				</Card>
			))}
		</Card>
	);
};

export default FacebookPostWrapper;
