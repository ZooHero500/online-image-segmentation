# Local Model Files

This directory can host browser AI model files so users download them from the ImgSplit domain/CDN instead of Hugging Face.

For the background remover, run:

```bash
bun run models:background-removal
```

This downloads the required `briaai/RMBG-1.4` files into a first-party runtime alias:

```text
public/models/imgsplit/rmbg-1.4/
```

At runtime, Transformers.js resolves the model locally first:

```text
/models/imgsplit/rmbg-1.4/config.json
/models/imgsplit/rmbg-1.4/preprocessor_config.json
/models/imgsplit/rmbg-1.4/onnx/model_quantized.onnx
```

Set `NEXT_PUBLIC_BACKGROUND_REMOVAL_MODEL_SOURCE=local` to disable Hugging Face fallback in production after the files are deployed.
