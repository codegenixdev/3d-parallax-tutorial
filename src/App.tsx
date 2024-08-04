import { CardBody, CardContainer, CardItem } from "./3d-hover";
import { product } from "./data.json";

export default function App() {
  return (
    <div className="h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ba78bd] to-[#613177]">
      <CardContainer className="inter-var">
        <CardBody className="group/card flex flex-col gap-5 rounded-xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ba78bd] to-[#613177] p-6 hover:shadow-lg">
          <CardItem translateZ="200" className="mt-4 w-full">
            <img
              src={product.src}
              className="h-60 w-full rounded-xl object-contain drop-shadow-lg group-hover/card:drop-shadow-xl"
              alt={product.title}
            />
          </CardItem>

          <CardItem
            translateZ="100"
            className="text-5xl font-bold text-gray-50"
          >
            {product.title}
          </CardItem>

          <CardItem
            translateZ="150"
            className="mt-2 max-w-sm text-xl font-semibold text-[#ffdb78]"
            component="p"
          >
            {product.description}
          </CardItem>
          <div className="mt-20 flex w-full items-center justify-between">
            <CardItem
              component="a"
              translateZ="50"
              href="/"
              className="rounded-xl px-4 text-lg font-normal dark:text-white"
            >
              Share
            </CardItem>
            <CardItem
              translateZ="50"
              className="self-start text-xl text-[#ffdb78]"
            >
              {product.price}
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
}
