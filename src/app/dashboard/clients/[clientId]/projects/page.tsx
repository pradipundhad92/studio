import { FC } from 'react';

interface PageProps {
  params: {
    clientId: string;
  };
}

const Page: FC<PageProps> = ({ params }) => {
  return (
    <div>
      <h1>Projects for Client {params.clientId}</h1>
      {/* Project list will go here */}
    </div>
  );
};

export default Page;
