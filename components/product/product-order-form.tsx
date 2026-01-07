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
        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-md shadow-2xl ring-1 ring-black/5">
            {/* Header Accent */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary/80 via-purple-500/80 to-primary/80" />

            {/* Ambient Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

            <div className="p-5 md:p-8 space-y-8 relative">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            অর্ডার করুন
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">আপনার পছন্দের চশমাটি পেতে ফর্মটি পূরণ করুন</p>
                    </div>
                    {derived.isFreeDelivery && (
                        <div className="hidden md:flex flex-col items-end">
                            <span className="animate-pulse inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20">
                                <Zap className="mr-1 h-3 w-3" /> ফ্রি ডেলিভারি
                            </span>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
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

                    <FormSection className="pt-2">
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
                        submittingOrder={state.submittingOrder}
                    />
                </div>
            </div>
        </div>
    );
}
