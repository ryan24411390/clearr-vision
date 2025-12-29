"use client";

import { Zap } from "lucide-react";
import { Product } from "@/lib/products";
import { useOrderForm } from "./order-form/use-order-form";
import { FormSection } from "./order-form/form-section";
import { QuantitySelector } from "./order-form/quantity-selector";
import { DeliverySelector } from "./order-form/delivery-selector";
import { ProductOptions } from "./order-form/product-options";
import { CustomerDetails } from "./order-form/customer-details";
import { OrderSummary } from "./order-form/order-summary";

interface ProductOrderFormProps {
    product: Product;
}

export function ProductOrderForm({ product }: ProductOrderFormProps) {
    const {
        state,
        setters,
        derived,
        actions
    } = useOrderForm(product);

    return (
        <div className="relative overflow-hidden rounded-2xl border bg-background/50 backdrop-blur-xl shadow-2xl ring-1 ring-white/20">
            {/* Header Accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />

            <div className="p-4 md:p-6 space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Order Now <span className="text-base font-normal text-muted-foreground">(অর্ডার করুন)</span>
                    </h3>
                    {derived.isFreeDelivery && (
                        <span className="animate-pulse inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-600/20">
                            <Zap className="mr-1 h-3 w-3" /> Free Delivery
                        </span>
                    )}
                </div>

                <div className="space-y-6">
                    <FormSection>
                        <QuantitySelector
                            quantity={state.quantity}
                            setQuantity={setters.setQuantity}
                            price={derived.price}
                        />

                        <DeliverySelector
                            location={state.location}
                            setLocation={setters.setLocation}
                        />

                        <ProductOptions
                            product={product}
                            color={state.color}
                            setColor={setters.setColor}
                            power={state.power}
                            setPower={setters.setPower}
                            errors={state.errors}
                            touched={state.touched}
                            setErrors={setters.setErrors}
                        />
                    </FormSection>

                    <FormSection className="pt-4">
                        <CustomerDetails
                            customerName={state.customerName}
                            setCustomerName={setters.setCustomerName}
                            phoneNumber={state.phoneNumber}
                            setPhoneNumber={setters.setPhoneNumber}
                            address={state.address}
                            setAddress={setters.setAddress}
                            errors={state.errors}
                            touched={state.touched}
                            handleBlur={actions.handleBlur}
                            validateField={actions.validateField}
                            setErrors={setters.setErrors}
                        />
                    </FormSection>

                    <OrderSummary
                        qtyNum={derived.qtyNum}
                        subtotal={derived.subtotal}
                        total={derived.total}
                        deliveryCharge={derived.deliveryCharge}
                        isFreeDelivery={derived.isFreeDelivery}
                        location={state.location}
                        handlePlaceOrder={actions.handlePlaceOrder}
                        handleAddToCart={actions.handleAddToCart}
                        submittingOrder={state.submittingOrder}
                        addingToCart={state.addingToCart}
                    />
                </div>
            </div>
        </div>
    );
}
