"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { Carousel, CarouselItem } from "@/components/ui/Carousel.client";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";
import { Saree } from "@/lib/types";

interface HomeNewArrivalsGridProps {
  sarees: Saree[];
}

export function HomeNewArrivalsGrid({ sarees }: HomeNewArrivalsGridProps) {
  const { staggerProps } = useInViewMotion();

  return (
    <>
      <motion.div
        {...staggerProps}
        variants={staggerContainer}
        className="hidden grid-cols-2 gap-4 md:grid md:grid-cols-4 md:gap-6"
      >
        {sarees.map((saree) => (
          <motion.div key={saree._id} variants={fadeUp}>
            <ProductCard saree={saree} />
          </motion.div>
        ))}
      </motion.div>

      <Carousel className="md:hidden">
        {sarees.map((saree) => (
          <CarouselItem key={saree._id} className="w-[72vw]">
            <ProductCard saree={saree} />
          </CarouselItem>
        ))}
      </Carousel>
    </>
  );
}
