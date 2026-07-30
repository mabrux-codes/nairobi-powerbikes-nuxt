<template>
  <div class="min-h-screen bg-brand-black flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="mb-10 flex justify-center">
        <img src="/NPB Logo.png" alt="Nairobi Powerbikes" class="h-14 w-auto" />
      </div>
      <slot />
    </div>
    <ToastContainer />
  </div>
</template>
