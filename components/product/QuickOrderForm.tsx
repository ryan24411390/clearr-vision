"use client";

import { Product } from "@/lib/products";
import { useOrderForm } from "./order-form/use-order-form";
import { SectionHeader } from "./order-form/form-section";
import { QuantitySelector } from "./order-form/quantity-selector";
import { DeliverySelector } from "./order-form/delivery-selector";
import { ProductOptions } from "./order-form/product-options";
import { CustomerDetails } from "./order-form/customer-details";
import { OrderSummary } from "./order-form/order-summary";
interface QuickOrderFormProps {
    product: Product;
}

export function QuickOrderForm({ product }: QuickOrderFormProps) {
    const {
        state,
        setters,
        derived,
        actions
    } = useOrderForm(product);

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-w-md mx-auto relative">
            {/* Top Funnel: Product Focus */}
            <div className="bg-primary/10 pt-8 pb-6 px-6 relative">
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                        ক্যাশ অন ডেলিভারি
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        ২ দিনে ডেলিভারি
                    </span>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-center text-primary">দ্রুত অর্ডার করুন</h3>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-500"></div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-2xl shadow-lg relative z-10 transform transition duration-500 group-hover:scale-105"
                        />
                    </div>

                    <div className="space-y-1">
                        <h4 className="font-bold text-xl leading-tight text-foreground">{product.name}</h4>
                        <p className="text-2xl font-extrabold text-primary">Tk {product.price}</p>
                    </div>
                </div>
            </div>

            {/* Bottom Funnel: Form */}
            <div className="p-6 md:p-8 space-y-8">

                <div id="selection-section" className="scroll-mt-20">
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
                </div>

                <div className="space-y-5 pt-2 border-t border-border/40">
                    <QuantitySelector
                        quantity={state.quantity}
                        setQuantity={setters.setQuantity}
                        price={derived.price}
                    />
                    <DeliverySelector
                        location={state.location}
                        setLocation={setters.setLocation}
                    />
                </div>

                <div className="pt-2 border-t border-border/40">
                    <SectionHeader title="আপনার তথ্য দিন" step="৪" />
                    <div className="mt-4">
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
                    </div>
                </div>

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
    );
}
